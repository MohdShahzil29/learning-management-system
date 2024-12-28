// User
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "student-service",
  brokers: ["192.168.242.77:9092"],
});

const producer = kafka.producer();

export const sendMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};
