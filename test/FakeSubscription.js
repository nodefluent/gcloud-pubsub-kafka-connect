"use strict";

class FakeSubscription {

    constructor(id, topicId, projectId) {
        this.id = id;
        this.topicId = topicId;
        this.projectId = projectId;

        this._exists = FakeSubscription.nextValues.exists;
    }

    get(options, callback) {
        // this._exists = true;
        // FakeDataset.createCalled = true;
        return callback(null, {id: this.id}, {});
    }

    pull(options, callback) {
        return callback(null, []);
    }

    static setNextMessages(messages) {
        FakeTopic.nextValues.messages = JSON.parse(JSON.stringify(messages));
    }

    static setNextExists(exists) {
        FakeSubscription.nextValues.exists = exists;
    }

    static resetCreateCalled() {
        FakeSubscription.createCalled = false;
    }
}

FakeSubscription.nextValues = {
    exists: true,
    messages: []
};

FakeSubscription.createCalled = false;

module.exports = FakeSubscription;
