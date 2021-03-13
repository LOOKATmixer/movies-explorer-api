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

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());
app.options('*', cors());

app.use(requestLogger);
app.use(rateLimiter);
app.use(helmet());

app.use(express.json());

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

mongoose.connect(MONGO_URL, {
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
