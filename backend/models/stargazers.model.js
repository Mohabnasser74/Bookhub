const { Schema, model } = require("mongoose");

const stargazersSchema = new Schema({
  repoID: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  stargazers: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      login: { type: String, default: null },
      url: { type: String, default: null },
      avatar_url: { type: String, default: "uploads/male-profile.jpg" },
      html_url: { type: String, default: null },
      repos_url: { type: String, default: null },
      role: { type: String, default: "user" },
    },
  ],
});

module.exports = model("Stargazer", stargazersSchema);
