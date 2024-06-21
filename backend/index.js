const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const booksRouter = require("./router/books.route.js");
const usersRouter = require("./router/users.route.js");
const authRouter = require("./router/check-auth.route.js");
const { ERROR } = require("./models/books.model");
const isAuth = require("./middleware/isAuth.js");

const app = express();

// Configure CORS
const corsOptions = {
  origin: "https://booksub.onrender.com",
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
};

app.use(cors(corsOptions));

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define the directory that contains the static files
const staticDirectory = path.join(__dirname, "/uploads");

// Use the static middleware to serve files from the static directory
app.use("/uploads", express.static(staticDirectory));

const store = new MongoDBSession({
  uri: process.env.URI_CONNECTION,
  collection: "sessions",
});

const sess = {
  secret: process.env.SESSION_SECRET || "MY_SESSION_SECRET_HAHAHA",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.httpOnly = true;
  sess.cookie.domain = ".onrender.com";
  sess.cookie.secure = true;
  sess.cookie.sameSite = "None";
  sess.cookie.path = "/";
}

app.use(session(sess));

app.get("/", isAuth, (_, res) => {
  res.json({
    data: null,
    message: "API",
  });
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);
// app.use("/auth", authRouter);

app.get("/check-auth", (req, res) => {
  if (req.session.isAuth) {
    return res.json({
      code: 200,
      isAuthenticated: true,
      username: req.session.username,
    });
  } else {
    return res.json({
      code: 401,
      isAuthenticated: false,
    });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    if (error.errors.email) {
      return res.status(404).json({
        message: `${error.errors.email.message}`,
        code: 400,
        data: null,
      });
    }
  }
  res.status(error.code || 500).json({
    status: error.status || ERROR,
    message: error.message,
    code: error.code || 500,
    data: null,
  });
});

// Global middleware for not found router
app.all("*", (req, res) => {
  res.status(404).json({
    status: ERROR,
    code: 404,
    data: null,
    message: "Page not found",
  });
});

// Connect to DB and start server
async function main() {
  await mongoose.connect(process.env.URI_CONNECTION);
  console.log("mongoose was started");
  app.listen(process.env.PORT, () => {
    console.log(`App is listening to port: ${process.env.PORT}`);
  });
}

main().catch((err) => console.log(err));
