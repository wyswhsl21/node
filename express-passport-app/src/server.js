const express = require('express');
const { default: mongoose } = require('mongoose');
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');

const mainRouter = require('./routes/users.router');
const usersRouter = require('./routes/users.router');
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

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// mongoose.connect(`mongodb://`);

app.use('/', mainRouter);
app.use('/auth', usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
