function checkAuthenticated(req, res, next) {
  //passport 에서 제공
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
