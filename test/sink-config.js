"use strict";

const path = require("path");
const Logger = require("log4bro");

const config = {
    kafka: {
        zkConStr: "localhost:2181/",
        logger: new Logger(),
        groupId: "kc-pubsub-test",
        clientName: "kc-pubsub-test-name",
        workerPerPartition: 1,
        options: {
            sessionTimeout: 8000,
            protocol: ["roundrobin"],
            fromOffset: "earliest", //latest
            fetchMaxBytes: 1024 * 100,
            fetchMinBytes: 1,
            fetchMaxWaitMs: 10,
            heartbeatInterval: 250,
            retryMinTimeout: 250,
            requireAcks: 0,
            //ackTimeoutMs: 100,
            //partitionerType: 3
        }
    },
    topic: "pubsub-test-topic",
    partitions: 1,
    maxTasks: 1,
    pollInterval: 250,
    produceKeyed: true,
    produceCompressionType: 0,
    connector: {
        batchSize: 1,
        maxPollCount: 1,
        projectId: "ps-project-id",
        topic: "ps-topic",
        idColumn: "id"
    }
};

module.exports = config;
