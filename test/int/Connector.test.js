"use strict";

const assert = require("assert");
const testdouble = require("testdouble");
const FakePubSub = require("../FakePubSub");
const FakeTopic = require("../FakeTopic");
const FakeSubscription = require("../FakeSubscription");
testdouble.replace("@google-cloud/pubsub", FakePubSub);

const { Producer } = require("sinek");
const { SourceRecord } = require("kafka-connect");
const { runSourceConnector, runSinkConnector, ConverterFactory } = require("./../../index.js");
const sourceProperties = require("./../source-config.js");
const sinkProperties = require("./../sink-config.js");

describe("Connector INT", () => {

    describe("Source connects and streams", () => {

        let config = null;
        let error = null;
        let messages = null;

        before("Setup PubSub fake", () => {

            messages = [
                {
                    data: {
                        id: 1,
                        name: "Item No. 1",
                        info: "Item Information"
                    },
                    attributes: {
                        timestamp: new Date().toISOString()
                    }
                },
                {
                    data: {
                        id: 2,
                        name: "Item No. 2",
                        info: null
                    },
                    attributes: {
                        timestamp: new Date().toISOString()
                    }
                },
                {
                    data: {
                        id: 3,
                        name: "Item No. 3",
                        info: "Item Information"
                    },
                    attributes: {
                        timestamp: new Date().toISOString()
                    }
                }
            ];

            FakeSubscription.setNextMessages(messages);
        });

        it("should be able to run PubSub source config", () => {
            const onError = _error => {
                error = _error;
            };
            return runSourceConnector(sourceProperties, [], onError).then(_config => {
                config = _config;
                config.on("record-read", id => console.log("read: " + id));
                return true;
            });
        });

        it("should be able to await a few pollings", done => {
            setTimeout(() => {
                assert.ifError(error);
                done();
            }, 4500);
        });

        it("should be able to fake a delete action", () => {
            const record = new SourceRecord();
            record.key = "1";
            record.value = null; //will cause this record to be deleted when read by sink-task

            return config.produce(record);
        });

        it("should be able to close configuration", done => {
            config.stop();
            setTimeout(done, 1500);
        });
    });

    describe("Source topic doesn't exist", () => {

        before("Setup PubSub fake", () => {
            FakeTopic.resetCreateCalled();
        });

        it("should be able to run PubSub source config and create the topic", done => {
            const onError = _error => {
                console.error(_error);
            };

            runSourceConnector(sourceProperties, [], onError)
                .then(_ => {
                    assert.ok(FakeTopic.createCalled);
                    done();
                })
                .catch(_error => {
                    done(new Error(`The source connector ran when it shouldn't: ${_error.message}`));
                });
        });
    });

    describe("Source subscription doesn't exist", () => {

        before("Setup PubSub fake", () => {
            FakeSubscription.resetCreateCalled();
        });

        it("should be able to run PubSub source config and create the subscription", done => {
            const onError = _error => {
                console.error(_error);
            };

            runSourceConnector(sourceProperties, [], onError)
                .then(_ => {
                    assert.ok(FakeSubscription.createCalled);
                    done();
                })
                .catch(_error => {
                    done(new Error(`The source connector ran when it shouldn't: ${_error.message}`));
                });
        });
    });

    describe("Sink connects, creates topic and streams", () => {

        before("Setup PubSub fake", () => {
            FakeTopic.resetCreateCalled();
            FakeTopic.resetLastPublishedMessages();
        });

        let config = null;
        let error = null;

        it("should be able to run the PubSub sink config", () => {
            const onError = _error => {
                error = _error;
            };
            return runSinkConnector(sinkProperties, [], onError).then(_config => {
                config = _config;
                config.on("model-upsert", id => console.log("upsert: " + id));
                config.on("model-delete", id => console.log("delete: " + id));
                return true;
            });
        });

        it("should be able to await a few message puts", done => {
            setTimeout(() => {
                assert.ifError(error);
                done();
            }, 4500);
        });

        it("should be able to close configuration", done => {
            config.stop();
            setTimeout(done, 1500);
        });

        it("should have created the topic", () => {
            assert.ok(FakeTopic.createCalled);
        });

        it("should be able to see messages", () => {
            assert.equal(FakeTopic.lastPublishedMessages.length, 3);
        });
    });
});
