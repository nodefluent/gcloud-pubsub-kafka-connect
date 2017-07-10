#!/usr/bin/env node

const program = require("commander");
const path = require("path");
const { runSinkConnector } = require("./../index.js");
const pjson = require("./../package.json");
const loadConfig = require("./../config/loadConfig.js");

program
    .version(pjson.version)
    .option("-c, --config [string]", "Path to Config (optional)")
    .option("-k, --kafka [string]", "Zookeeper Connection String")
    .option("-g, --group [string]", "Kafka ConsumerGroup Id")
    .option("-t, --topic [string]", "Kafka Topic to read from")
    .option("-p, --project_id [string]", "GCloud project id")
    .option("-u, --pubsub-topic [string]", "PubSub topic")
    .option("-i, --id_column [string]", "Id column for message keys")
    .option("-o, --batch_size [integer]", "Batch size for PubSub publishes inserts")
    .parse(process.argv);

const config = loadConfig(program.config);

if (program.kafka) {
    config.kafka.zkConStr = program.kafka;
}

if (program.name) {
    config.kafka.clientName = program.name;
}

if (program.topic) {
    config.topic = program.topic;
}

if (program.project_id) {
    config.connector.projectId = program.project_id;
}

if (program.subscription) {
    config.connector.subscription = program.subscription;
}

if (program.pubsub_topic) {
    config.connector.topic = program.pubsub_topic;
}

if (program.id_column) {
    config.connector.idColumn = program.id_column;
}

if (program.batch_size) {
    config.connector.batchSize = program.batch_size;
}

runSinkConnector(config, [], console.log.bind(console)).then(sink => {

    const exit = (isExit = false) => {
        sink.stop();
        if (!isExit) {
            process.exit();
        }
    };

    process.on("SIGINT", () => {
        exit(false);
    });

    process.on("exit", () => {
        exit(true);
    });
});
