const { Schema, model } = require("mongoose");

const repositorySchema = new Schema({
  username: { type: String, required: true, ref: "User" },
  books: [
    {
      bookId: {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
      addedDate: {
        type: Date,
      },
      stargazers_count: {
        type: Number,
        default: 0,
      },
    },
  ],
  lastModified: {
    type: Date,
    default: new Date().toUTCString(),
  },
});

module.exports = new model("Repositoie", repositorySchema);
