# gcloud-pubsub-kafka-connect
Kafka Connect connector for Google Cloud's PubSub

[![Build Status](https://travis-ci.org/nodefluent/glouc-pubsub-kafka-connect.svg?branch=master)](https://travis-ci.org/nodefluent/glouc-pubsub-kafka-connect)

[![Coverage Status](https://coveralls.io/repos/github/nodefluent/glouc-pubsub-kafka-connect/badge.svg?branch=master)](https://coveralls.io/github/nodefluent/glouc-pubsub-kafka-connect?branch=master)

## Use API

```
npm install --save glouc-pubsub-kafka-connect
```

### pubsub -> kafka

```es6
const { runSourceConnector } = require("glouc-pubsub-kafka-connect");
runSourceConnector(config, [], onError).then(config => {
    //runs forever until: config.stop();
});
```

### kafka -> pubsub

```es6
const { runSinkConnector } = require("glouc-pubsub-kafka-connect");
runSinkConnector(config, [], onError).then(config => {
    //runs forever until: config.stop();
});
```

### kafka -> pubsub (with custom topic (no source-task topic))

```es6
const { runSinkConnector, ConverterFactory } = require("glouc-pubsub-kafka-connect");

const etlFunc = (messageValue, callback) => {

    return callback(null, {
        id: messageValue.payload.id,
        name: messageValue.payload.name,
        info: messageValue.payload.info
    });
};

const converter = ConverterFactory.createSinkSchemaConverter({}, etlFunc);

runSinkConnector(config, [converter], onError).then(config => {
    //runs forever until: config.stop();
});

/*
    this example would be able to store kafka message values
    that look like this (so completely unrelated to messages created by a default SourceTask)
    {
        payload: {
            id: 1,
            name: "first item",
            info: "some info"
        },
        type: "publish"
    }
*/
```

## Use CLI
note: in BETA :seedling:

```
npm install -g gcloud-pubsub-kafka-connect
```

```
# run source etl: pubsub -> kafka
nkc-pubsub-source --help
```

```
# run sink etl: kafka -> pubsub
nkc-pubsub-sink --help
```

## Config(uration)
```es6
const config = {
    kafka: {
        zkConStr: "localhost:2181/",
        logger: null,
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
            requireAcks: 1,
            //ackTimeoutMs: 100,
            //partitionerType: 3
        }
    },
    topic: "pubsub-test-topic",
    partitions: 1,
    maxTasks: 1,
    pollInterval: 2000,
    produceKeyed: true,
    produceCompressionType: 0,
    connector: {
        batchSize: 500,
        maxPollCount: 500,
        projectId: "bq-project-id",
        subscription: "ps_subscription",
        topic: "ps_topic",
        idColumn: "id"
    },
    http: {
        port: 3149,
        middlewares: []
    },
    enableMetrics: true
};
```
