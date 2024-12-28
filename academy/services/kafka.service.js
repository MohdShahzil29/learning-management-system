import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "academy-service",
  brokers: ["192.168.242.77:9092"],
});

const consumer = kafka.consumer({ groupId: "recruiter-group" });
let userCache = {};

export const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const userData = JSON.parse(message.value.toString());
      console.log("User Data:", userData);

      // Map 'id' to '_id' for compatibility
      userCache[userData.email] = {
        ...userData,
        _id: userData.id, // Ensure compatibility
      };
    },
  });
};

export const getUserFromKafka = async (req) => {
  const userEmail = req.headers["user-email"];
  console.log("Fetched user-email from headers:", userEmail);

  if (!userEmail) {
    return undefined;
  }

  console.log("Current User Cache:", userCache);
  const user = userCache[userEmail];
  console.log("Fetched user from Kafka:", user);
  return user?._id;
};
