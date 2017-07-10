"use strict";

const async = require("async");
const { SinkTask } = require("kafka-connect");

class PubSubSinkTask extends SinkTask {

    start(properties, callback, parentConfig) {

        this.parentConfig = parentConfig;
        this.properties = properties;
        const {
            topic,
            maxTasks,
            batchSize,
            idColumn
        } = this.properties;

        this.topic = topic;
        this.batchSize = batchSize;
        this.maxTasks = maxTasks;
        this.idColumn = idColumn;

        this.buffer = [];
        this.bufferDraining = false;

        this._stats = {
            batchRuns: 0,
            messagesPublished: 0,
            publishErrors: 0
        };

        this.parentConfig.on("get-stats", () => {
            this.parentConfig.emit("any-stats", "pubsub-sink", this._stats);
        });

        callback();
    }

    drainBuffer() {
        if (this.bufferDraining) {
            return Promise.resolve();
        }

        this.bufferDraining = true;

        return new Promise((resolve, reject) => {
            async.whilst(
                () => this.buffer.length !== 0,
                next => this.runBatch().then(() => next()),
                error => {
                    if (error) {
                        return reject(error);
                    }

                    this.bufferDraining = false;
                    resolve();
                }
            );
        });
    }

    runBatch(){

        const messages = this.buffer.splice(0, Math.min(this.batchSize, this.buffer.length));

        return new Promise((resolve, reject) => this.topic.publish(
            messages,
            {raw: true},
            (error, messageIds, apiResponse) => {
                this._stats.batchRuns++;
                if(error){
                    this._stats.publishErrors++;
                    return reject(JSON.stringify(error));
                }

                this._stats.messagesPublished += messages.length;
                resolve();
            }));
    }

    putRecords(records) {
        return new Promise((resolve, reject) => {

            records.forEach(record => {

                if (!record.value || record.value === "null") {
                    // PubSub is message publishing append only so we'll silently drop empty messages
                    this.parentConfig.emit("model-delete", record.key.toString());
                    return;
                }

                this.parentConfig.emit("model-upsert", record.key.toString());
                const message = {
                    data: record.value,
                    attributes: {
                        timestamp: record.timestamp
                    }
                };

                this.buffer.push(message);
            });

            if(this.buffer.length >= this.batchSize){
                return this.drainBuffer()
                    .then(() => resolve())
                    .catch(error => reject(error));
            }

            resolve();
        });
    }

    put(records, callback) {
        this.putRecords(records)
            .then(() => callback(null))
            .catch(error => callback(error));
    }

    stop() {
        //empty
    }
}

module.exports = PubSubSinkTask;
