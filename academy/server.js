import http from "http";
import app from "./app.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`User service ruuning on ${PORT} port..`);
});
