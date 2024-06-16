const cacheMiddleware = (req, res, next) => {
  const cacheControl = "public, max-age=3600"; // 1 hour cache
  res.header("Cache-Control", cacheControl);
  next();
};

module.exports = cacheMiddleware;
