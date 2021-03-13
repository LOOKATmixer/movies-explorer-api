const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const addMovie = (req, res, next) => {
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Неправильно переданы данные');
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Введены некорректные данные'),
        );
      }
      next(err);
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Данные не найдены');
      }
      res.send(movies);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;
  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('Вы не можете удалить фильм');
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
