const Book = require("../models/books.model");
const UserRepository = require("../models/repositories.model");
const Profile = require("../models/profiles.model");

const asyncWrapper = require("../middleware/asyncWrapper");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");

const getBooks = asyncWrapper(async (req, res) => {
  const books = await Book.find({}, { __v: false });

  res.status(200).json({
    status: SUCCESS,
    code: 200,
    count: books.length,
    data: {
      books,
    },
  });
});

const addAndPublishBook = asyncWrapper(async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next({
      status: FAIL,
      code: 400,
      message: "All fields are required",
    });
  }

  const newBook = new Book({
    title,
    author: req.session.username || req.cookies.dotcom_user,
    createdAt: Date.now(),
  });

  await newBook.save();

  await UserRepository.updateOne(
    { username: req.session.username },
    {
      $push: {
        books: {
          bookId: newBook._id,
          addedDate: newBook.createdAt,
        },
      },
      $set: {
        lastModified: new Date().toUTCString(),
      },
    },
    { upsert: true }
  );

  await Profile.findOneAndUpdate(
    { login: req.cookies.dotcom_user },
    { $inc: { count_repos: 1 }, updatedAt: new Date() }
  );

  res.status(201).json({
    status: SUCCESS,
    code: 201,
    message: "Book Publish Successfully",
  });
});

const getBook = asyncWrapper(async (req, res, next) => {
  const username = req.params.username;
  const currentUser = req.session.username || req.cookies.dotcom_user;
  const isCurrentUser = currentUser === username;
  const book = await Book.findById(req.params.id, { __v: false });

  if (!book) {
    return next({
      status: FAIL,
      code: 404,
      message: "Not Found",
    });
  }

  res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");

  return res.status(200).json({
    status: SUCCESS,
    code: 200,
    data: {
      book,
    },
    message: "Book fetched successfully",
    isCurrentUser,
  });
});

const updateOneBook = asyncWrapper(async (req, res, next) => {
  // put -> books/:id
  const { title } = req.body;

  if (!title) {
    return next({
      status: FAIL,
      statusCode: 400,
      message: "All fields are required",
    });
  }

  const book = await Book.findByIdAndUpdate(req.params.id, {
    $set: {
      title,
      updatedAt: new Date(),
    },
  });

  if (!book) {
    return next({
      status: FAIL,
      code: 404,
      message: "Not Found",
    });
  }

  await UserRepository.updateOne(
    { username: req.session.username },
    {
      $set: {
        lastModified: new Date().toUTCString(),
      },
    },
    { upsert: true }
  );

  // res.setHeader("Cache-Control", "no-cache");

  return res.status(201).json({
    status: SUCCESS,
    code: 201,
    message: "Book Updated Successfully",
  });
});

const deleteOneBook = asyncWrapper(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next({
      status: FAIL,
      code: 404,
      message: "Not Found",
    });
  }

  await Profile.findOneAndUpdate(
    { login: req.cookies.dotcom_user },
    { $inc: { count_repos: -1 }, updatedAt: new Date() }
  );

  await UserRepository.updateOne(
    { username: req.session.username },
    {
      $pull: { books: { bookId: req.params.id } },
      $set: {
        lastModified: new Date().toUTCString(),
      },
    },
    { upsert: true }
  );

  res.status(200).json({
    status: SUCCESS,
    code: 200,
    message: "Book Deleted Successfully",
    data: null,
  });
});

module.exports = {
  getBooks,
  addAndPublishBook,
  getBook,
  updateOneBook,
  deleteOneBook,
};

// put, patch
// get
