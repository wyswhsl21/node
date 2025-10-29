const express = require('express');
const { default: mongoose } = require('mongoose');
const path = require('path');
const User = require('./models/users.model');
const passport = require('passport');
const cookieSession = require('cookie-session');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('./middlewares/auth');
const app = express();
const cookieEncryptionKey = 'supersecretkey';

app.use(
  cookieSession({
    keys: [cookieEncryptionKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.json({
        msg: info,
      });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);

      res.redirect('/');
    });
  })(req, res, next);
});

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const user = new User(req.body);

  //user collection에 저장
  try {
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
});
//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// mongoose.connect(`mongodb://`);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
