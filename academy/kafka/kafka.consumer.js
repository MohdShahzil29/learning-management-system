import { Kafka } from "kafkajs";
import { consumeMessages } from "../services/kafka.service.js";

const kafka = new Kafka({
  clientId: "academy-service",
  brokers: ["192.168.242.77:9092"],
});

const consumer = kafka.consumer({ groupId: "academy-group" });

export const startConsumer = async () => {
  await consumeMessages(); 
};
