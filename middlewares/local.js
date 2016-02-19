var config = require('../config')

module.exports = function (req, res, next) {
  req.app.locals.baseImageURL = config.baseImageURL;
  req.app.locals.avatar = config.avatar;
  next();
};