const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//req.login(user)
//세션 데이터 생성
passport.serializeUser((user, done) => {
  done(null, user.id);
});
//client => session => request
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ email: email.toLocaleLowerCase() }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { msg: `Email ${email} not found` });
        }

        user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);

          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: 'Invalid password' });
        });
      });
    }
  )
);
