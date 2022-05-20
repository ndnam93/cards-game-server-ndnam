const httpStatus = require('http-status');
const { Card } = require('../models');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
/**
 * Query for all cards
 * @returns {Promise<QueryResult>}
 */
const queryCards = async () => {
  const cards = await Card.find({}, null, {
    sortBy: { name: 'asc' },
  });
  return cards;
};

const getCardsByUserEmail = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const cardIds = user.cards.map((card) => card.card_id);
  const cardCount = user.cards.reduce((result, card) => ({ ...result, [card.card_id]: card.count }), {});
  let cards = await Card.find({ _id: { $in: cardIds } });
  cards = cards.map((card) => ({
    ...card.toJSON(),
    count: cardCount[card._id.toString()],
  }));

  return cards;
};

module.exports = {
  queryCards,
  getCardsByUserEmail,
};
