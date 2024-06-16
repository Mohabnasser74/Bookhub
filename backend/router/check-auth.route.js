const express = require("express");

const authRouter = express.Router();

authRouter.get("/check-auth", (req, res) => {
  if (req.session.isAuth) {
    res.json({
      code: 200,
      isAuthenticated: true,
      username: req.session.username,
    });
  } else {
    res.json({
      code: 200,
      isAuthenticated: false,
      username: req.session.username,
    });
  }
});

module.exports = authRouter;
