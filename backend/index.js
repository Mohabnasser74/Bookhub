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

const app = express();

// Define the directory that contains the static files
const staticDirectory = path.join(__dirname, "/uploads");

// Use the static middleware to serve files from the static directory
app.use("/uploads", express.static(staticDirectory));

const store = new MongoDBSession({
  uri: process.env.URI_CONNECTION,
  collection: "sessions",
});

// Configure CORS
app.use(
  cors({
    origin: "https://booksub.netlify.app", // Specify your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  })
);

// Trust proxy setting for secure cookies if behind a proxy
app.set("trust proxy", 1);

// Apply middleware
app.use(cookieParser("secret key to my session"));
app.use(express.json());

app.use(
  session({
    secret: "secret key to my session",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true, // Set to true if using HTTPS
    },
  })
);

const isAuth = require("./middleware/isAuth.js");

app.get("/", isAuth, (req, res) => {
  res.json({
    status: "success",
    code: 200,
    data: null,
    message: "API",
  });
});

app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

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
  await mongoose.connect(process.env.URI_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("mongoose was started");
  app.listen(process.env.PORT, () => {
    console.log(`App is listening to port: ${process.env.PORT}`);
  });
}

main().catch((err) => console.log(err));
