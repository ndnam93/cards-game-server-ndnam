const catchAsync = require('../utils/catchAsync');
const { cardService } = require('../services');

const getCards = catchAsync(async (req, res) => {
  const result = await cardService.queryCards();
  res.send(result);
});

module.exports = {
  getCards,
};
