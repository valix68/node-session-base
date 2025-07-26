const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing fields" });

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashed });
    res.json({ message: "User registered", user: { id: user.id, username } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  // Lưu userId vào session
  req.session.userId = user.id;
  res.json({ message: "Logged in successfully" });
});

// Đăng xuất
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// API yêu cầu xác thực
router.get("/profile", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findByPk(req.session.userId, { attributes: ["id", "username"] });
  res.json({ user });
});

// API không cần xác thực
router.get("/public", (req, res) => {
  res.json({ message: "This is public" });
});

module.exports = router;
