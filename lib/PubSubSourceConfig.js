"use strict";

const {SourceConfig} = require("kafka-connect");

class PubSubSourceConfig extends SourceConfig {

    constructor(...args){ super(...args); }

    run(){
        return super.run();
    }
}

module.exports = PubSubSourceConfig;
