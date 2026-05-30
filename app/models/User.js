// app/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// HASH PASSWORD BEFORE SAVE
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARE PASSWORD
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
