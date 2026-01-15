import { test, expect } from '@playwright/test';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import {Admin, Producer, Consumer, stringSerializers, jsonSerializer, stringDeserializers} from '@platformatic/kafka'

const bootstrapServer = 'localhost:9092';

test.skip('send message', async ({ page }) => {

  const kafka = new KafkaJS.Kafka({
    kafkaJS: {
      brokers: [bootstrapServer],
    },
  });

  const producer = kafka.producer();

  await producer.connect();

  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello, Kafka!' },
    ],
  });

  await producer.disconnect();
});

test.skip('confluent - create topic and send message', async ({ page }) => {

  const kafka = new KafkaJS.Kafka({
    kafkaJS: {
      brokers: [bootstrapServer],
    },
  });

  const admin = kafka.admin()
  await admin.connect();

  await admin.createTopics({ topics: [{ topic: 'test-topic' }] });
  console.log("Created topic");

  await admin.disconnect();

  const producer = kafka.producer();

  await producer.connect();

  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello, Kafka!' },
    ],
  });

  await producer.disconnect();
});

test('platformatic - create topic and send message', async ({ page }) => {
  // Create an admin client
  const admin = new Admin({
    clientId: 'my-admin',
    bootstrapBrokers: [bootstrapServer]
  })

  // Create topics
  await admin.createTopics({
    topics: ["test-topic"],
    partitions: 1,
    replicas: 1
  })

// Close the admin client when done
  await admin.close()

  const producer = new Producer({
    clientId: 'my-producer',
    bootstrapBrokers: [bootstrapServer], // Replace with your Kafka broker(s)
    serializers: stringSerializers,
  });

  // Send messages
  await producer.send({
    messages: [
      {
        topic: "test-topic",
        key: "1",
        value: 'Hello, Kafka!'
      }
    ]
  });

  await producer.close();

  // Create a consumer with string deserialisers
  const consumer = new Consumer({
    groupId: 'my-consumer-group',
    clientId: 'my-consumer',
    bootstrapBrokers: [bootstrapServer],
    deserializers: stringDeserializers
  })

  // Create a consumer stream
  const stream = await consumer.consume({
    autocommit: false,
    mode: "latest",
    topics: ["test-topic"],
    sessionTimeout: 10000,
    heartbeatInterval: 500
  })

  // Option 2: Async iterator consumption
  for await (const message of stream) {
    console.log(`Received: ${message.key} -> ${message.value}`)
    await stream.close()
  }

  // Close the consumer when done
  await consumer.close()

});