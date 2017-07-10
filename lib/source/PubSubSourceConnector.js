"use strict";

const async = require("async");

const { SourceConnector } = require("kafka-connect");
const PubSub = require("@google-cloud/pubsub");

class PubSubSourceConnector extends SourceConnector {

    start(properties, callback) {

        this.properties = properties;

        const pubSub = new PubSub({projectId: this.properties.projectId});
        const topic = pubSub.topic(this.properties.topic);

        async.waterfall(
            [
                done => {
                    topic.get({autoCreate: true}, (error, _topic, apiResponse) => {
                        if (error) {
                            return done(error);
                        }

                        done(null, _topic);
                    });
                },
                (_topic, done) => {
                    const subscription = _topic.subscription(this.properties.subscription);
                    subscription.get({autoCreate: true}, (error, _subscription, apiResponse) => {
                        if (error) {
                            return done(error);
                        }

                        done(null, _subscription);
                    });
                }
            ],
            (error, _subscription) => {
                if (error) {
                    return callback(error);
                }
                this.subscription = _subscription;
                callback();
            }
        );
    }

    taskConfigs(maxTasks, callback) {

        const taskConfig = {
            maxTasks,
            maxPollCount: this.properties.maxPollCount,
            topic: this.properties.topic,
            subscription: this.subsription,
            idColumn: this.properties.idColumn
        };

        callback(null, taskConfig);
    }

    stop() {
        //empty
    }
}

module.exports = PubSubSourceConnector;
