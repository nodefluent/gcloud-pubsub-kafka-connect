"use strict";

const uuid = require("uuid");

class FakeSubscription {

    constructor(id, topicId, projectId) {
        this.id = id;
        this.topicId = topicId;
        this.projectId = projectId;
    }

    get(options, callback) {
        FakeSubscription.createCalled = options && options.autoCreate || false;
        return callback(null, this, {});
    }

    pull(options, callback) {
        const messagesWithAckIds = FakeSubscription.nextValues.messages.map(message =>
        {
            message.ackId = uuid.v4();
            return message;
        });
        FakeSubscription.nextValues.messages = [];

        return callback(null, messagesWithAckIds);
    }

    ack(ackIds, callback) {
        FakeSubscription.lastAckIds = ackIds;
        callback();
    }

    static setNextMessages(messages) {
        FakeSubscription.nextValues.messages = JSON.parse(JSON.stringify(messages));
    }

    static resetCreateCalled() {
        FakeSubscription.createCalled = false;
    }

    static resetLastAckIds() {
        FakeSubscription.lastAckIds = [];
    }
}

FakeSubscription.nextValues = {
    messages: []
};

FakeSubscription.lastAckIds = [];
FakeSubscription.createCalled = false;

module.exports = FakeSubscription;
