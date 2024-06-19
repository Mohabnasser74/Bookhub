const express = require("express");

const authRouter = express.Router();

authRouter.get("/check-auth", (req, res) => {
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

module.exports = authRouter;
