const express = require("express");
const {
  getBooks,
  addAndPublishBook,
  getBook,
  updateOneBook,
  deleteOneBook,
} = require("../controllers/books.controllers");

const isAuthenticated = require("../middleware/isAuthenticated.js");

const booksRouter = express.Router();

booksRouter.route("/").get(getBooks).post(isAuthenticated, addAndPublishBook);

booksRouter
  .route("/:username/:id")
  .get(isAuthenticated, getBook)
  .put(isAuthenticated, updateOneBook)
  .delete(isAuthenticated, deleteOneBook);

module.exports = booksRouter;
