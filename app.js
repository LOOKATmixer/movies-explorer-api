// index.js — входной файл
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const cors = require('cors');
require('dotenv').config();
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');
const rateLimiter = require('./middlewares/rateLimit');

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(requestLogger);

app.use(routes);

app.use('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use(helmet());
app.use(rateLimiter);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.connection.on('open', () => console.log('db connected!'));
mongoose.connection.on('error', () => console.log('db NOT connected!'));

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
