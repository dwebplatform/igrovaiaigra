require('dotenv').config();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;
const Trener = db.treners;
//TODO: перененсти checkTrener и checkUser в отдельный файл
 
module.exports = (app) => {
  const users = require('../controllers/login.controller');
  let router = require("express").Router();
  // Create a new Tutorial 
  // проверить jwt авторизацию с паспорт js
  router.post('/login',users.multipleLogin);
  
  router.get('/subjects-for-current-trener', passport.authenticate('jwt', { session: false }), async (req,res)=>{
    let items = await req.serviceUtilContainer.getSubjects();
    return res.json({
            status:'test interface work service',
            items:items
    })
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
