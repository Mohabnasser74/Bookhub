const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      default: new Date(new Date()).getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new model("Book", bookSchema);
