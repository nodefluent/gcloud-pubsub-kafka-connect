"use strict";

const {SinkConfig} = require("kafka-connect");

class PubSubSinkConfig extends SinkConfig {

    constructor(...args){ super(...args); }

    run(){
        return super.run();
    }
}

module.exports = PubSubSinkConfig;
