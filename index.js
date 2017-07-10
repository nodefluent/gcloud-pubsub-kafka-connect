"use strict";

const PubSubSourceConfig = require("./lib/PubSubSourceConfig.js");
const PubSubSinkConfig = require("./lib/PubSubSinkConfig.js");

const PubSubSourceConnector = require("./lib/source/PubSubSourceConnector.js");
const PubSubSinkConnector = require("./lib/sink/PubSubSinkConnector.js");

const PubSubSourceTask = require("./lib/source/PubSubSourceTask.js");
const PubSubSinkTask = require("./lib/sink/PubSubSinkTask.js");

const JsonConverter = require("./lib/utils/JsonConverter.js");
const ConverterFactory = require("./lib/utils/ConverterFactory.js");

const runSourceConnector = (properties, converters = [], onError = null) => {

    const config = new PubSubSourceConfig(properties,
        PubSubSourceConnector,
        PubSubSourceTask, [JsonConverter].concat(converters));

    if (onError) {
        config.on("error", onError);
    }

    return config.run().then(() => {
        return config;
    });
};

const runSinkConnector = (properties, converters = [], onError = null) => {

    const config = new PubSubSinkConfig(properties,
        PubSubSinkConnector,
        PubSubSinkTask, [JsonConverter].concat(converters));

    if (onError) {
        config.on("error", onError);
    }

    return config.run().then(() => {
        return config;
    });
};

module.exports = {
    runSourceConnector,
    runSinkConnector,
    ConverterFactory
};
