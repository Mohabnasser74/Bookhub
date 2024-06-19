const bcrypt = require("bcryptjs");

const User = require("../models/users.model");
const Profile = require("../models/profiles.model");
const UserRepository = require("../models/repositories.model");

const asyncWrapper = require("../middleware/asyncWrapper");
const { SUCCESS, FAIL, ERROR } = require("../utils/httpStatusText");

const baseUrl = "https://bookhub-ik4s.onrender.com";

const getUser = asyncWrapper(async (req, res, next) => {
  const username = req.params.username;
  const currentUser = req.session.username || req.cookies.dotcom_user;
  const user = await Profile.findOne({ login: username }, { __v: false });

  if (!user) {
    return next({
      status: ERROR,
      code: 404,
      message: "Not Found",
    });
  }

  res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");

  res.status(200).json({
    status: SUCCESS,
    code: 200,
    user,
    message: "Users fetched successfully",
    isCurrentUser: currentUser === username,
  });
});

const signup = asyncWrapper(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return next({
      status: FAIL,
      code: 400,
      message: "All fields are required",
    });
  }

  const cUserN = await User.find({ username });
  const cUserE = await User.find({ email });

  if (cUserN[0]) {
    return next({
      status: FAIL,
      code: 400,
      message: `An account with this username already exists`,
    });
  }

  if (cUserE[0]) {
    return next({
      status: FAIL,
      code: 400,
      message: `An account with this email already exists`,
    });
  }

  const hash_p = await bcrypt.hash(password, 10);

  await new User({
    username,
    email,
    password: hash_p,
  }).save();

  const newProfile = new Profile({
    login: username,
    url: `${baseUrl}/users/${username}`,
    html_url: `${baseUrl}/${username}`,
    repos_url: `${baseUrl}/users/${username}/repos`,
    role: role,
  });

  await newProfile.save();

  res.cookie("logged_in", "true", {
    maxAge: 3600,
    httpOnly: true,
    secure: true,
    path: "/",
  });
  res.cookie("dotcom_user", username, {
    maxAge: 3600,
    httpOnly: true,
    secure: true,
    path: "/",
  });

  if (req.session) {
    req.session.isAuth = true;
    req.session.username = username;
  } else {
    return next({
      status: FAIL,
      code: 404,
      message: "session is not created",
    });
  }

  res.status(201).json({
    status: "success",
    code: 201,
    data: null,
    message: "User created successfully",
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({
      status: FAIL,
      code: 400,
      message: "All fields are required",
    });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return next({
      status: FAIL,
      code: 400,
      message: `"${email}" is not a valid email!`,
    });
  }

  const currentUser = await User.find({ email });

  if (!currentUser[0]) {
    return next({
      status: FAIL,
      code: 404,
      message: "We don't have an account with that email address.",
    });
  }

  const isMatch = await bcrypt.compare(password, currentUser[0].password);
  if (!isMatch) {
    return next({
      status: FAIL,
      code: 400,
      message: "Wrong email or password",
    });
  }
  res.cookie("logged_in", "true", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });
  res.cookie("dotcom_user", `${currentUser[0].username}`, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });

  req.session.isAuth = true;
  req.session.username = currentUser[0].username;

  await Profile.findOneAndUpdate(
    {
      login: req.session.username || currentUser[0].username,
    },
    {
      $set: {
        lastLogin: new Date(),
      },
    }
  );

  res.status(201).json({
    status: "success",
    code: 201,
    data: null,
    message: "User logged in successfully",
  });
});

const logout = asyncWrapper(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({
        status: "error",
        message: "Could not log out",
      });
    }

    // Clear cookies
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
    });

    // Optionally clear any additional cookies
    res.cookie("logged_in", "false", {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.clearCookie("dotcom_user", { path: "/" });

    // Send response after session is destroyed and cookies are cleared
    res.json({
      code: 200,
      message: "logOut",
      data: null,
    });
  });
});

const getRepos = asyncWrapper(async (req, res, next) => {
  const username = req.params.username;

  const repos = await UserRepository.find(
    {
      username: username,
    },
    { __v: false }
  )
    .populate({
      path: "books.bookId",
      select: "title author updatedAt", // Ensure these fields exist in the Book schema
    })
    .exec();

  if (!repos) {
    return next({
      status: ERROR,
      code: 404,
      message: "Not Found",
    });
  }

  if (repos.length <= 0) {
    res.status(200).json({
      status: SUCCESS,
      code: 200,
      count: 0,
      repos: [],
      message: "No repositories yet",
    });
    return;
  }

  if (
    req.headers["if-modified-since"] &&
    new Date(req.headers["if-modified-since"]) >=
      new Date(repos[0].lastModified)
  ) {
    res.setHeader("Last-Modified", `${repos[0].lastModified}`);
    res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
    return res.status(304).end();
  }

  res.setHeader("Last-Modified", `${repos[0].lastModified}`);
  res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");

  res.status(200).json({
    status: SUCCESS,
    code: 200,
    count: repos[0]["books"].length,
    repos: repos[0]["books"],
    message: "Repos fetched successfully",
  });
});

module.exports = {
  getUser,
  signup,
  login,
  logout,
  getRepos,
};
