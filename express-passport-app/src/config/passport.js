const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

const localStrategyConfig = new LocalStrategy(
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
);
passport.use('local', localStrategyConfig);

const googleClientId = '';
const googleClientSecret = '';
const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile'],
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }, function (err, existingUser) {
      if (err) return done(err);

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const user = new User();
        user.email = profile.emails[0].value;
        user.googleId = profile.id;
        user.save((err) => {
          console.log(err);

          if (err) {
            return done(err);
          }
          return done(null, user);
        });
      }
    });
  }
);

passport.use('google', googleStrategyConfig);
