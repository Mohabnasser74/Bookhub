const express = require("express");
const {
  getUser,
  signup,
  login,
  logout,
  getRepos,
  editProfile,
  star,
} = require("../controllers/users.controllers");
const isAuthenticated = require("../middleware/isAuthenticated.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const usersRouter = express.Router();

usersRouter.get("/status", (req, res) => {
  if (req.session.userId) {
    res.status(200).json({
      code: 200,
      loggedIn: true,
      username: req.session.username,
    });
  } else {
    res.status(200).json({
      code: 200,
      loggedIn: false,
      username: null,
    });
  }
});
usersRouter.post("/signup", upload.single("male-profile"), signup);
usersRouter.post("/login", login);
usersRouter.get("/logout", isAuthenticated, logout);
usersRouter.get("/:username", getUser);
usersRouter.get("/:username/repos", getRepos);
usersRouter.put("/:username/edit-profile", isAuthenticated, editProfile);
usersRouter.post("/star/:username/:id", isAuthenticated, star);

module.exports = usersRouter;
