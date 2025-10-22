const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'secretKey';

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
/**
 * req body로 받을 수 있게 middleware 연결
 */
app.use(express.json());

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  /** 토큰 생성하기 jwt 를 이용해서 토큰 생성 */
  const accessToken = jwt.sign(user, secretKey);
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

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
