import express from 'express';

//로그를 위한 미들웨어
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('running...');
});

//회원가입
app.post('/users', async (req, res) => {
  const user = await AppDataSource.getRepository(User).create(req.body);
  console.log(user);
  const result = await AppDataSource.getRepository(User).save(user);
  return res.send(result);
});

app.get('/users', async (req, res) => {
  const result = await AppDataSource.getRepository(User).find();
  res.json(result);
});

app.get('/users/:id', async (req, res) => {
  const result = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  res.json(result);
});

app.put('/users/:id', async (req, res) => {
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  AppDataSource.getRepository(User).merge(user, req.body);
  const result = await AppDataSource.getRepository(User).save(user);
  return res.send(result);
});

app.delete('/users/:id', async (req, res) => {
  const result = await AppDataSource.getRepository(User).delete(
    Number(req.params.id)
  );
  return res.json(result);
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization', error);
  });
