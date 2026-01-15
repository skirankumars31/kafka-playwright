import { KafkaContainer } from "@testcontainers/kafka";

const IMAGE = "confluentinc/cp-kafka:8.0.2";


async function main() {
    const container = await new KafkaContainer(IMAGE).start();
    console.log(container.getHost());
    console.log(container.getMappedPort(9093));
}

main();