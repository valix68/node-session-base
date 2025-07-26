const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

// Kết nối Redis (node-redis@4 cần connect() trước khi dùng)
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
