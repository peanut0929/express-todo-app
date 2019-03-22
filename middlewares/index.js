exports.setSessionFlash = (req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
};

exports.authenticate = (req, res, next) => {
  if (!req.session.isLogged && !req.session.user) {
    return res.redirect('/user/login');
  }

  next();
};
