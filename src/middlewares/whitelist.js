const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const whitelist = async (req, res, next) => {
  const whiteList = process.env.WHITELIST.split(',');
  const ip = req.connection.remoteAddress;
  console.log('Client IP: ', ip);
  if (whiteList.includes(ip)) {
    next();
  } else {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }
};

module.exports = whitelist;
