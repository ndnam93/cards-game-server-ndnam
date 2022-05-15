const { Card } = require('../models');

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

module.exports = {
  queryCards,
};
