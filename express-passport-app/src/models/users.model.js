const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
  },
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //bcrypt compare
  if (plainPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  return cb({
    error: 'error',
  });
};
const User = mongoose.model('User', userSchema);

module.exports = User;
