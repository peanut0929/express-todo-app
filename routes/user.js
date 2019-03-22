const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

/* GET users listing. */
router
  .get('/login', (req, res, next) => {
    const { sessionFlash } = res.locals;
    res.render('login.art', {
      errorMsg:
        sessionFlash && sessionFlash.type === 'error'
          ? sessionFlash.message
          : null
    });
  })
  .get('/register', (req, res, next) => {
    const { sessionFlash } = res.locals;
    res.render('register.art', {
      errorMsg:
        sessionFlash && sessionFlash.type === 'error'
          ? sessionFlash.message
          : null
    });
  })
  .get('/log-out', userController.logOut)
  .post('/login', userController.login)
  .post('/register', userController.register);

module.exports = router;
