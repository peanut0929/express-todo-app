const UserModel = require('../models/user');
const { setFlash } = require('../utils/index');

module.exports = {
  login: (req, res, next) => {
    const { body } = req;
    const { name, password } = body;

    if (!name || !password) {
      req.setFlash('请完整填写登录信息', '/user/login');
    } else {
      UserModel.findOne({ name }).exec((err, user) => {
        if (!err) {
          if (user) {
            user.comparePassword(password, (err, result) => {
              console.log(result);
              if (result) {
                req.session.user = user;
                req.session.isLogged = true;

                res.redirect('/');
              } else {
                req.setFlash('密码错误', '/user/login');
              }
            });
          } else {
            req.setFlash('此用户未注册', '/user/login');
          }
        }
      });
    }
  },
  register: (req, res, next) => {
    const { body } = req;
    const { name, password } = body;

    if (!name || !password) {
      req.setFlash('请完整填写注册信息', '/user/login');
    } else {
      UserModel.findOne({ name }).exec((err, user) => {
        if (!err) {
          if (user) {
            req.setFlash('此用户已存在', '/user/register');
          } else {
            UserModel.create({
              name,
              password
            }).then(user => {
              req.session.user = user;
              req.session.isLogged = true;

              res.redirect('/');
            });
          }
        }
      });
    }
  },
  logOut: (req, res, next) => {
    delete req.session.user;
    req.session.isLogged = false;

    res.redirect('/user/login');
  }
};
