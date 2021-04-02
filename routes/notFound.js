const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
