const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { use } = require("node-mysql-admin/middleware/auth/authroutes");
 

/** 
 * @method {"GET"}  
 * @param {*} res 
 */
exports.loginPage = (req,res)=>{
    return res.render('login', {
        email:'',
        password:''
    });
}

 

/**
 *
 *@method {"POST"} 
 *@description register new user
 */
exports.registerUser = async(req,res)=>{// регистрируем пользователя
    let { email, password } = req.body;
    if(!email || !password){// проверяем поля
      return res.json({
        status:'error',
        msg:'invalid email or password'
      });
    }
    else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password.trim(), salt, async function(err, hash) {// хешируем и создаем пользователя
            if(err) {
              return res.json({
                status:'error'
              });
            }
            try {
              let frashUser = await User.create({
                email:email,
                password:hash
              });
              if(frashUser instanceof User){
                return res.json({
                  status:'ok',
                  msg:'succefully created'
                });
              }
            } catch(e){
              return res.json({
                status:'error'
              })
            }
        });
    });
    }
}
 
 