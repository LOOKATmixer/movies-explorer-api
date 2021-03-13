const router = require('express').Router();
const { validateUserRegister, validateUserLogin } = require('../middlewares/celebrateValidation');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFoundRouter = require('./notFound');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', validateUserRegister, createUser);
router.post('/signin', validateUserLogin, login);
router.use(auth);
router.use('/', notFoundRouter);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
