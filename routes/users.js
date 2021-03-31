const router = require('express').Router();
const { validateUserUpdate } = require('../middlewares/celebrateValidation');
const { getUser, updateProfile } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
