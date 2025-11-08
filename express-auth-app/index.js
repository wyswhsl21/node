const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { ref } = require('process');

const app = express();
const secretKey = 'secretKey';
const refreshSecretKey = 'refreshSecretKey';

const posts = [
  {
    username: 'John',
    title: 'Post 1',
    description: 'This is the first post',
  },
  {
    username: 'Jane',
    title: 'Post 2',
    description: 'This is the second post',
  },
];
let refreshTokens = [];
/**
 * req body로 받을 수 있게 middleware 연결
 */
app.use(express.json());
app.use(cookieParser());

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, secretKey, { expiresIn: '15s' });

  //refresh token
  const refreshToken = jwt.sign(user, refreshSecretKey, { expiresIn: '1d' });
  refreshTokens.push(refreshToken);
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  /** 토큰 생성하기 jwt 를 이용해서 토큰 생성 */
  res.json({ accessToken: accessToken });
});

app.get('/posts', authMiddleware, (req, res) => {
  res.json(posts);
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  // 토큰 없으면 401 error
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/refresh', (req, res) => {
  //cookie Parser 사용해서 쿠키 파싱
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(401);

  const refreshToken = cookie.jwt;

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ name: user.username }, secretKey, {
      expiresIn: '15s',
    });
    res.json({ accessToken: accessToken });
  });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
