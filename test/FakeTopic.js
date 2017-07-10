"use strict";

class FakeTopic {

    constructor(id, projectId) {
        this.id = id;
        this.projectId = projectId;

        this._exists = FakeTopic.nextValues.exists;
        this._messages = JSON.parse(JSON.stringify(FakeTopic.nextValues.messages));
    }

    get(options, callback) {
        // this._exists = true;
        // FakeTopic.lastCreateOptions = JSON.parse(JSON.stringify(options));
        // FakeTopic.createCalled = true;

        return callback(
            null,
            {},
            {});
    }

    publish(messages, options, callback) {
        // FakeTopic.lastInsertedMessages.push(...messages);
        // return callback(null, {raw: options.raw, rowCount: FakeTopic.lastInsertedMessages.length});
    }

    static setNextExists(exists) {
        FakeTopic.nextValues.exists = exists;
    }

    static resetLastInsertedMessages() {
        FakeTopic.lastInsertedMessages = [];
    }

    static resetCreateCalled() {
        FakeTopic.createCalled = false;
    }
}

FakeTopic.nextValues = {
    exists: true,
    description: {}
};

FakeTopic.lastInsertedMessages = [];
FakeTopic.createCalled = false;
FakeTopic.alreadyExistsResponseActive = false;

module.exports = FakeTopic;
