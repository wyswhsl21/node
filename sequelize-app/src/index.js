const express = require('express');
const db = require('./model');
const User = db.users;

/** db 초기화 및 재 싱크  */
// db.sequelize
//   .sync({
//     force: true,
//   })
//   .then(() => {
//     console.log('데이터베이스 동기화 완료!');
//   });

const app = express();
app.use(express.json());

app.post('/users', (req, res) => {
  const { firstName, lastName, hasCar } = req.body;

  const user = {
    firstName,
    lastName,
    hasCar,
  };

  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '유저 생성하는데 에러 발생!.',
      });
    });
});

app.get('/users', (req, res) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '유저 조회하는데 에러 발생!.',
      });
    });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findByPk(id).then((user) => {
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({
        message: `id 가 ${id} 인 유저를 찾을 수 없습니다.`,
      });
    }
  });
});

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: '유저 업데이트 완료!' });
      } else {
        res.send({ message: '유저 업데이트 실패!. 존재하지 않는 유저.' });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '유저 업데이트하는데 에러 발생!.',
      });
    });
});

app.delete('users/:id', (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: '유저가 성공적으로 삭제되었습니다.' });
      } else {
        res.send({
          message: `${id} 인 유저를 찾지 못했습니다.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || '유저 삭제하는데 에러 발생!.',
      });
    });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log('4000번 포트에서 서버가 실행되었습니다.');
});
