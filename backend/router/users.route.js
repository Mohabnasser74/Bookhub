const express = require("express");
const {
  getUser,
  register,
  login,
  logout,
  getRepos,
} = require("../controllers/users.controllers");
const isAuth = require("../middleware/isAuth.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const usersRouter = express.Router();

usersRouter.post("/register", upload.single("male-profile"), register);
usersRouter.post("/login", login);
usersRouter.get("/logout", isAuth, logout);
usersRouter.get("/:username", getUser);
usersRouter.get("/:username/repos", getRepos);

module.exports = usersRouter;
