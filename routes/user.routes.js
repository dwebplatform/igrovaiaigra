const verifyToken = require('../utils/verifyToken');
module.exports = (app) => {
    const users = require('../controllers/login.controller');
    let router = require("express").Router();
    // Create a new Tutorial
      
    router.get('/all', verifyToken, users.usersProtected);
    router.get('/login',users.loginPage);     
    app.use('/api/users', router);
  };