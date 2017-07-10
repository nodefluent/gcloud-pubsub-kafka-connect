"use strict";

const FakeTopic = require("./FakeTopic");

class FakePubSub {

    constructor(options) {
        this.options = options;
    }

    topic(id) {
        return new FakeTopic(id, this.options.projectId);
    }
}

module.exports = FakePubSub;
