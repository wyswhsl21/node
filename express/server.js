const express = require('express');
/** router */
const usersRouter = require('./routes/users.router');
const postsRouter = require('./routes/posts.router');
const productsRouter = require('./routes/products.router');

const { default: mongoose } = require('mongoose');
const path = require('path');

const PORT = 4000;
const app = express();

mongoose
  .connect(
    `mongodb+srv://wyswhsl21:wodmswodn12@cluster0.keutjvp.mongodb.net/?appName=Cluster0`
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

/** JSON 파싱 미들웨어 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** template engine 서버에 등록  */
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
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

/** template engine 사용 */
app.get('/', (req, res) => {
  res.render('index', {
    imageTitle: 'It is a forest',
  });
});

//에러 처리기
app.use((err, req, res, next) => {
  res.json({
    message: err.message,
  });
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/products', productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
