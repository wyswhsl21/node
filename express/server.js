const express = require('express');
const usersController = require('./controllers/users.controller');
const postsController = require('./controllers/posts.controller');
const PORT = 4000;
/** router */
const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');

const app = express();
/**
 * app use는 미들웨어 생성
 * next 는 다음 미들웨어로 이동
 */
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url}`);
  next();
  const diffTime = Date.now() - start;

  console.log(`end : ${req.method} ${req.baseUrl} ${req.url} ${diffTime}`);
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
