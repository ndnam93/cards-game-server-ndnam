const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getCardsByUserEmail = {
  query: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const updateUserCards = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    cards: Joi.array().items(
      Joi.object().keys({
        card_id: Joi.required().custom(objectId),
        count: Joi.number().integer().required().min(1),
      })
    ),
  }),
};

module.exports = {
  getCardsByUserEmail,
  updateUserCards,
};
