const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  login: { type: String, default: null },
  avatar_url: { type: String, default: "uploads/male-profile.jpg" },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  email: { type: String, default: null },
  url: { type: String, default: null },
  html_url: { type: String, default: null },
  repos_url: { type: String, default: null },
  bio: { type: String, default: null },
  count_repos: { type: Number, default: 0 },
  gender: { type: String, default: "male" },
});

module.exports = model("Profile", profileSchema);
