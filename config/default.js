"use strict";

const path = require("path");

const config = {
    kafka: {
        zkConStr: "localhost:2181/",
        logger: null,
        groupId: "kc-pubsub-group",
        clientName: "kc-pubsub-client",
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
            autoCommit: true,
            autoCommitIntervalMs: 1000,
            requireAcks: 1,
            //ackTimeoutMs: 100,
            //partitionerType: 3
        }
    },
    topic: "pubsub_topic",
    partitions: 1,
    maxTasks: 1,
    pollInterval: 250,
    produceKeyed: true,
    produceCompressionType: 0,
    connector: {
        batchSize: 100,
        maxPollCount: 100,
        projectId: "ps-project-id",
        subscription: "ps-subscription",
        topic: "ps-topic",
        idColumn: "id"
    },
    http: {
        port: 3149,
        middlewares: []
    },
    enableMetrics: true
};

module.exports = config;
