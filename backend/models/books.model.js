const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: [
      //   true,
      //   `The repository ${{
      //     value: this.title,
      //   }} already exists on this account.`,
      // ],
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      default: new Date(new Date()).getFullYear(),
    },
    stargazers_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new model("Book", bookSchema);
