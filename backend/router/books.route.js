const express = require("express");
const {
  getBooks,
  addAndPublishBook,
  getBook,
  updateOneBook,
  deleteOneBook,
} = require("../controllers/books.controllers");

const isAuth = require("../middleware/isAuth.js");

const booksRouter = express.Router();

booksRouter.route("/").get(getBooks).post(isAuth, addAndPublishBook);

booksRouter
  .route("/:username/:id")
  .get(isAuth, getBook)
  .put(isAuth, updateOneBook)
  .delete(isAuth, deleteOneBook);

module.exports = booksRouter;
