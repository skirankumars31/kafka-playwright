import { test, expect } from '@playwright/test';
import { KafkaJS } from '@confluentinc/kafka-javascript';

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

test('create topic and send message', async ({ page }) => {

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