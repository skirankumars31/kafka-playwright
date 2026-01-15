// producer.ts
import { KafkaJS } from '@confluentinc/kafka-javascript';

const bootstrapServer = 'localhost:9092';

async function runProducer() {
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
}

async function runAdminClient() {
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
}