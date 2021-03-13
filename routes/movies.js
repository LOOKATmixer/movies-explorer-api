const router = require('express').Router();

const { validateMovie, validateMovieId } = require('../middlewares/celebrateValidation');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovie, addMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
