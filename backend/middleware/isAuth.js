const { FAIL } = require("../utils/httpStatusText");

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    req.session.lastPath = true;
    res.status(401).json({
      status: FAIL,
      code: 401,
      message: "Unauthorized",
      data: null,
    });
  }
};

module.exports = isAuth;
