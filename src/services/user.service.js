const httpStatus = require('http-status');
const _ = require('lodash');
const { User, Card } = require('../models');
const ApiError = require('../utils/ApiError');

const COIN_BUDGET = 10;

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => User.findOne({ email });

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserCardsByUserId = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const cardIds = _.map(updateBody, 'card_id');
  const cards = await Card.find(
    {
      _id: {
        $in: cardIds,
      },
    },
    '_id price'
  );
  const queriedCardIds = _.map(cards, '_id');
  if (cardIds.length !== queriedCardIds.length) {
    const invalidIds = _.difference(cardIds, queriedCardIds);
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid card ids: ${invalidIds.join(', ')}`);
  }

  const totalCost = updateBody.reduce((cost, item) => {
    const cardPrice = _.find(cards, (card) => item.card_id === card._id.toString()).price;
    return cost + item.count * cardPrice;
  }, 0);
  if (totalCost > COIN_BUDGET) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Budget exceeded');
  }

  Object.assign(user, { cards: updateBody });
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUserCardsByUserId,
};
