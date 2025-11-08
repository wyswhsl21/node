const express = require('express');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('../middlewares/auth');
const User = require('../models/users.model');
const usersRouter = express.Router();

usersRouter.post('/login', (req, res, next) => {
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

usersRouter.post('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

usersRouter.post('/signup', async (req, res) => {
  const user = new User(req.body);

  //user collection에 저장
  try {
    await user.save();
    sendMail();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
});

usersRouter.get('/auth/google', passport.authenticate('google'));

usersRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = usersRouter;
