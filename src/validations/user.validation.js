const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
    })
    .min(1),
};

const updateUserCards = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.array().items(
    Joi.object().keys({
      card_id: Joi.required().custom(objectId),
      count: Joi.number().integer().required().min(1),
    })
  ),
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  updateUserCards,
};
