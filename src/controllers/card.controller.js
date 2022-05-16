const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { cardService, userService } = require('../services');

const getCards = catchAsync(async (req, res) => {
  const result = await cardService.queryCards();
  res.send(result);
});

const getCardsByUserEmail = catchAsync(async (req, res) => {
  const result = await cardService.getCardsByUserEmail(req.query.email);
  res.send(result);
});

const updateUserCards = catchAsync(async (req, res) => {
  let user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!(await user.isPasswordMatch(req.body.password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password');
  }
  user = await userService.updateUserCardsByUserId(user._id, req.body.cards);
  res.send(user);
});

module.exports = {
  getCards,
  getCardsByUserEmail,
  updateUserCards,
};
