"use strict";

const FakeSubscription = require("./FakeSubscription");

class FakeTopic {

    constructor(id, projectId) {
        this.id = id;
        this.projectId = projectId;
    }

    get(options, callback) {
        FakeTopic.createCalled = options && options.autoCreate || false;

        return callback(
            null,
            this,
            {});
    }

    subscription(id) {
        return new FakeSubscription(id, this.id, this.projectId);
    }

    publish(messages, options, callback) {
        FakeTopic.lastPublishedMessages.push(...messages);

        return callback(null, messages);
    }

    static resetLastPublishedMessages() {
        FakeTopic.lastPublishedMessages = [];
    }

    static resetCreateCalled() {
        FakeTopic.createCalled = false;
    }
}

FakeTopic.nextValues = {
    description: {}
};

FakeTopic.lastPublishedMessages = [];
FakeTopic.createCalled = false;

module.exports = FakeTopic;
