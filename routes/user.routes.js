require('dotenv').config();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;

async function checkUser( email, password, res) {
  let user = await User.findOne({
    where: { email }
  });

  if (!user) {
    return res.json({
      status: 'error',
      msg: 'none auth'
    });
  }
  let originalPassword = user.password;
  bcrypt.compare(password, originalPassword, function (err, result) {
    if (err) {
      return res.json({
        status: 'error',
        msg: 'not matched'
      })
    }
    if (result) {
      let payload = { id: user.id };
      jwt.sign(payload, 'kitty_mitty', {}, (err, token) => {
        if (err) return res.json({ status: 'error' });
          res.json({
          success: 'ok',
          token: 'Bearer ' + token,
        });
      });

    }

  })
}
module.exports = (app) => {
  const users = require('../controllers/login.controller');
  let router = require("express").Router();
  // Create a new Tutorial 
  // проверить jwt авторизацию с паспорт js
  router.post('/login', async (req, res) => {
    const { email, password, type } = req.body;
    if (!email || !password) {
      return res.json({
        status: 'error',
        msg: 'no email or password were provided'
      });
    }
    try {
      if (type === 'user') {
         res.cookie('type','user');
         checkUser(email, password,res);
      } else {
        return res.json({
          status: 'error',
          msg: 'no type were provided'
        })
      }
    } catch (err) {
      return res.json({
        status: 'error'
      });
    }
  });
  router.get('/protected-info', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
      status: 'ok',
      msg: 'this is protected route'
    })
  })
  // к этим потом вернусь
  // router.post('/login', users.checkUser);
  // router.post('/register', users.registerUser);
  // router.get('/all', verifyToken, users.usersProtected);
  // router.get('/login',users.loginPage);
  app.use('/api/users', router);
};