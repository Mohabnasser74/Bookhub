const bcrypt = require("bcryptjs");

const User = require("../models/users.model");
const Profile = require("../models/profiles.model");
const UserRepository = require("../models/repositories.model");
const Book = require("../models/books.model");
const Stargazer = require("../models/stargazers.model");

const asyncWrapper = require("../middleware/asyncWrapper");
const { SUCCESS, FAIL, ERROR } = require("../utils/httpStatusText");

const baseUrl = "https://bookhub-ik4s.onrender.com";
const htmlUrl = "https://booksub.onrender.com";

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

  // res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");

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

  const newUser = await new User({
    username,
    email,
    password: hash_p,
  }).save();

  const newProfile = new Profile({
    login: username,
    url: `${baseUrl}/users/${username}`,
    html_url: `${htmlUrl}/${username}`,
    repos_url: `${baseUrl}/users/${username}/repos`,
    role: role,
  });

  await newProfile.save();

  res.cookie("logged_in", "true", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.cookie("dotcom_user", username, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  if (req.session) {
    req.session.userId = newUser._id;
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

  req.session.userId = currentUser[0]._id;
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

  res.cookie("logged_in", "true", {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.cookie("dotcom_user", `${currentUser[0].username}`, {
    domain: ".bookhub-ik4s.onrender.com",
    path: "/",
    maxAge: 3600,
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });

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
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.clearCookie("dotcom_user", {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    // Optionally clear any additional cookies
    res.cookie("logged_in", "false", {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

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
      select: "title author updatedAt publishYear", // Ensure these fields exist in the Book schema
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
    stargazers_count: repos[0]["stargazers_coun"] || 0,
    message: "Repos fetched successfully",
  });
});

const editProfile = asyncWrapper(async (req, res, next) => {
  const username = req.params.username;

  const { name, bio, company, location } = req.body;

  const user = await Profile.findOneAndUpdate(
    {
      login: username,
    },
    {
      $set: {
        name: name,
        bio: bio,
        company: company,
        location: location,
        updatedAt: new Date(),
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next({
      status: ERROR,
      code: 404,
      message: "Not Found",
    });
  }

  res.status(200).json({
    status: SUCCESS,
    code: 200,
    user,
    message: "Profile updated successfully",
  });
});

const star = asyncWrapper(async (req, res, next) => {
  // Find the book by its ID and update the stargazers count
  // book id-> req.params.id
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      $inc: { stargazers_count: 1 },
    },
    { new: true } // This option returns the updated document
  );

  if (!book) {
    return next({
      status: 404,
      code: 400,
      message: "Book Not Found",
    });
  }

  // Find the user repository by book ID and update the lastModified and stargazers_count
  const repo = await UserRepository.findOneAndUpdate(
    { "books.bookId": req.params.id },
    {
      $set: {
        lastModified: new Date().toUTCString(),
        "books.$.stargazers_count": book.stargazers_count,
      },
    },
    { new: true } // This option returns the updated document
  );

  if (!repo) {
    return next({
      status: 404,
      code: 400,
      message: "Repository Not Found",
    });
  }

  const user = await Profile.find({ login: req.session.username });

  await Stargazer.updateOne(
    { repoID: req.params.id },
    {
      $push: {
        stargazers: {
          userID: user[0]._id,
          login: user[0].login,
          url: user[0].url,
          avatar_url: user[0].avatar_url,
          html_url: user[0].html_url,
          repos_url: user[0].repos_url,
          role: user[0].role,
        },
      },
    },
    { upsert: true }
  );

  res.status(201).json({
    count: book.stargazers_count,
  });
});

const unstar = asyncWrapper(async (req, res, next) => {
  // Find the book by its ID and update the stargazers count
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      $inc: { stargazers_count: -1 },
    },
    { new: true } // This option returns the updated document
  );

  if (!book) {
    return next({
      status: 404,
      code: 400,
      message: "Book Not Found",
    });
  }

  // Find the user repository by book ID and update the lastModified and stargazers_count
  const repo = await UserRepository.findOneAndUpdate(
    { "books.bookId": req.params.id },
    {
      $set: {
        lastModified: new Date().toUTCString(),
        "books.$.stargazers_count": book.stargazers_count,
      },
    },
    { new: true } // This option returns the updated document
  );

  if (!repo) {
    return next({
      status: 404,
      code: 400,
      message: "Repository Not Found",
    });
  }

  await Stargazer.updateOne(
    { repoID: req.params.id },
    {
      $pull: {
        stargazers: {
          login: req.params.username,
        },
      },
    },
    { upsert: true }
  );

  res.status(201).json({
    count: book.stargazers_count,
  });
});

const stargazers = asyncWrapper(async (req, res, next) => {
  const repoID = req.params.id;

  console.log(repoID);

  const usersStargazers = await Stargazer.find(
    {
      repoID: repoID,
    },
    { __v: false, repoID: false, _id: false }
  );

  res.status(200).json(usersStargazers[0]["stargazers"]);
});

// http://localhost:5000/users/:username/:id/stargazers

module.exports = {
  getUser,
  signup,
  login,
  logout,
  getRepos,
  editProfile,
  star,
  unstar,
  stargazers,
};
