const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // creates a unique index -> no duplicate accounts
      lowercase: true, // always stored in lowercase
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

module.exports = mongoose.model("User", userSchema);
