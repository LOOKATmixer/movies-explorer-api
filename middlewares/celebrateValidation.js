const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const validatorURL = (url) => {
  if (!validator.isURL(url)) {
    throw new BadRequestError('Неверная ссылка');
  }
  return url;
};

const validateUserRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().allow(null, '').required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().allow(null, '').required(),
    nameEN: Joi.string().allow(null, '').required(),
    image: Joi.string().required().custom(validatorURL),
    thumbnail: Joi.string().required().custom(validatorURL),
    trailer: Joi.string().required().custom(validatorURL),
    movieId: Joi.number().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }),
});

module.exports = {
  validateUserRegister,
  validateUserUpdate,
  validateMovie,
  validateMovieId,
  validateUserLogin,
};
