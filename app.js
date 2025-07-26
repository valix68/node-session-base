const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis"); 
const redisClient = require("./config/redis");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

// Parse JSON
app.use(express.json());

// Tạo RedisStore với connect-redis v9
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:", // tiền tố key trong Redis
});

// Dùng session + Redis
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // đặt true nếu chạy HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 giờ
    },
  })
);

// Routes
app.use("/auth", authRoutes);

// Sync DB
sequelize.sync().then(() => console.log("✅ Database synced"));

module.exports = app;
