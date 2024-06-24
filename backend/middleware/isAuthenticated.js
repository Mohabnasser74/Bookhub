const { FAIL } = require("../utils/httpStatusText");

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({
      status: FAIL,
      code: 401,
      message: "Unauthorized",
      data: null,
    });
  }
};

module.exports = isAuthenticated;
