const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthError = require('../errors/UnauthError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new UnauthError('Неверно введен id'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (req.body.password.length < 6) {
    throw new BadRequestError(
      'Ошибка валидации. Пароль должен состоять из 6 или более символов',
    );
  } else {
    bcrypt
      .hash(password.toString(), 10)
      .then((hash) => User.create({
        name,
        email,
        password: hash,
      }))
      .then((newUser) => {
        if (!newUser) {
          throw new NotFoundError('Неправильно переданы данные');
        } else {
          res.send({
            name: newUser.name,
            email: newUser.email,
          });
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ConflictError('Данный email уже зарегистрирован'));
        }
        next(err);
      });
  }
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthError('Авторизация не пройдена');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateProfile,
  login,
};
