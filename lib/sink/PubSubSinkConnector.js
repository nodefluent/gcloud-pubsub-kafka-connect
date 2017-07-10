"use strict";

const { SinkConnector } = require("kafka-connect");
const PubSub = require("@google-cloud/pubsub");

class PubSubSinkConnector extends SinkConnector {

    start(properties, callback) {

        this.properties = properties;

        const pubsub = new PubSub({projectId: this.properties.projectId});
        const topic = pubsub.topic(this.properties.topic);

        topic.get({autoCreate: true}, (error, _topic, apiResponse) => {
            if (error) {
                return callback(error);
            }

            this.topic = _topic;
            callback();
        });
    }

    taskConfigs(maxTasks, callback) {

        const taskConfig = {
            maxTasks,
            batchSize: this.properties.batchSize,
            topic: this.topic,
            idColumn: this.properties.idColumn
        };

        callback(null, taskConfig);
    }

    stop() {
        // nothing to do
    }
}

module.exports = PubSubSinkConnector;
