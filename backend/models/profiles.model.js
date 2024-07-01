const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  login: { type: String, default: null },
  url: { type: String, default: null },
  avatar_url: { type: String, default: "uploads/male-profile.jpg" },
  html_url: { type: String, default: null },
  repos_url: { type: String, default: null },
  name: { type: String, default: null },
  company: { type: String, default: null },
  location: { type: String, default: null },
  email: { type: String, default: null },
  bio: { type: String, default: null },
  role: { type: String, default: "user" },
  gender: { type: String, default: "male" },
  count_repos: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = model("Profile", profileSchema);
