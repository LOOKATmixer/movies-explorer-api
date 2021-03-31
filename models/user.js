const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const UnauthError = require('../errors/UnauthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверный email!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthError('Неправильные почта или пароль');
        }
        return user;
      });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
