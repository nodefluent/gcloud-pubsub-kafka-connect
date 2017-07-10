"use strict";

const { SourceTask, SourceRecord } = require("kafka-connect");

class PubSubSourceTask extends SourceTask {

    start(properties, callback, parentConfig) {

        this.parentConfig = parentConfig;

        this.properties = properties;
        const {
            topic,
            subscription,
            maxTasks,
            maxPollCount,
            idColumn
        } = this.properties;

        this.topic = topic;
        this.subscription = subscription;
        this.maxTasks = maxTasks;
        this.maxPollCount = maxPollCount;
        this.idColumn = idColumn;

        this._stats = {
            totalPulls: 0,
            messagesPulled: 0,
            messagesAcked: 0,
            pullErrors: 0
        }

        this.parentConfig.on("get-stats", () => {
            this.parentConfig.emit("any-stats", "pubsub-source", this._stats);
        });

        callback(null);
    }

    poll(callback) {

        this.subscription.pull(
            {
                maxResults: this.maxPollCount,
                returnImmediately: true
            },
            (error, messages, apiResponse) => {
                if (error) {
                    this._stats.pullErrors++;
                    return callback(error);
                }

                this._stats.totalPulls++;
                this._stats.messagesPulled += messages.length;

                const records = messages.map(message => {

                    const record = new SourceRecord();

                    if (this.idColumn) {
                        record.key = message.data[this.idColumn];
                    }
                    record.keySchema = null;

                    if (!record.key) {
                        throw new Error("pubsub results are missing id column");
                    }

                    record.value = message.data;
                    record.valueSchema = {};

                    record.timestamp = message.attributes.timestamp;
                    record.partition = -1;
                    record.topic = this.topic;

                    this.parentConfig.emit("record-read", record.key.toString());
                    return record;
                });

                const ackIds = messages.map(message => message.ackId);
                if (!ackIds || ackIds.length === 0) {
                    return callback(null, records);
                }

                this.subscription.ack(ackIds, (error, apiResponse) => {
                    if (error) {
                        return callback(error);
                    }

                    callback(null, records);
                });
            }
        );
    }

    stop() {
        //empty
    }
}

module.exports = PubSubSourceTask;
