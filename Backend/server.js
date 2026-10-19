require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("./models/User");
const { hashPassword, verifyPassword } = require("./utils/password");

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Fail fast if the secret is missing — a token signed with "undefined" is useless
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing. Create a .env file (see .env.example).");
  process.exit(1);
}

// No CORS needed — the frontend calls /api on its own port (5173)
// and Vite's dev server proxies it here (see Frontend/vite.config.js).
app.use(express.json());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Never send passwordHash to the client
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });

// ---------------------------------------------------------------------------
// POST /api/register  →  { name, email, password }  →  { token, user }
// ---------------------------------------------------------------------------
app.post("/api/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name, email and password are required" });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email address" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password),
    });

    // Log the user in right away by returning a token
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    // Duplicate key = someone registered the same email a split second earlier
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "An account with this email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/login  →  { email, password }  →  { token, user }
// ---------------------------------------------------------------------------
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Same message for "no user" and "wrong password" on purpose
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Fallback error handler (DB down, unexpected bugs, ...)
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

// ---------------------------------------------------------------------------
// Start server only after MongoDB is connected
// ---------------------------------------------------------------------------
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Auth API running on http://localhost:${PORT}`);
  });
});
