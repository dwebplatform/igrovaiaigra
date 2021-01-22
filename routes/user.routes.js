require('dotenv').config();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;
module.exports = (app) => {
    const users = require('../controllers/login.controller');
    let router = require("express").Router();
    // Create a new Tutorial 
    // проверить jwt авторизацию с паспорт js
	router.post('/login', async (req,res)=>{
		const { email, password } = req.body;
		 try {
			let user = await User.findOne({
						where:{ email }
					});
					if(!user){
						return res.json({
							status:'error',
							msg:'none auth'
						});
			}
	let originalPassword = user.password;
	bcrypt
      .compare(password, originalPassword)
      .then(isMatch => {
        if (isMatch) {
          // user matched
          const payload = { id : user.id }; //jwt payload
          //TODO secret to .env
          jwt.sign(payload, process.env.SECRET_OR_KEY, { }, (err, token) => {
            if(err) return res.json({status:'error'});
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          });
        } else {
          return res.json({
          	status:'error'
          });
        }
    }).catch(err => console.log(err));
		 } catch(err){
		 	console.log(err)
		 	return res.json({
		 		status:'error'
		 	});
		 }
  });

  router.get('/protected-info', passport.authenticate('jwt', {session: false}),(req,res)=>{
        return res.json({
          status: 'ok',
          msg: 'this is protected route'
        })
  });

    // к этим потом вернусь
    // router.post('/login', users.checkUser);
    // router.post('/register', users.registerUser);
    // router.get('/all', verifyToken, users.usersProtected);
    // router.get('/login',users.loginPage);
    app.use('/api/users', router);
  };