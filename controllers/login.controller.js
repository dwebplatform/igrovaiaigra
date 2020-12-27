const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 

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
 * @method {"GET"} 
 * @authorization 
 */
exports.usersProtected = (req,res)=>{

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
          res.sendStatus(403);
        } else {
          res.json({
            message: 'Post created...',
            authData
          });
        }
      });   
}

/**
 *
 *@method {"POST"} 
 *@description register new user
 */
exports.registerUser = async(req,res)=>{// регистрируем пользователя
    let {email, password} = req.body;
    if(!email ||!password){// проверяем поля
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
/**
 * @method {"POST"} req 
 * @params {password, email} вход пользователя по jwt
 */
exports.checkUser = async (req,res)=>{
    let {password, email} = req.body;
    try{
        let user = await User.findOne({
            where:{
                email: email.trim()
            }
        });
        if(user instanceof User){
            let hashedPass = user.password;
            bcrypt.compare(password, hashedPass, function(err, result) {
                 if(err){
                    return res.json({
                        status:'error',
                        err
                    })
                }
                if(result){
                    jwt.sign({user:{
                      id:user.id,
                      email: user.email,
                      password: user.password
                    }}, 'secretkey', (err, token) => {
                       if(err){
                           return res.json({
                               status:'error',
                               msg:'not authorized'
                           });
                       }
                       return res.json({
                        status:'ok',
                        token,
                        type:'user'
                      });
                    });
                } else {
                    return res.json({
                        status:'error',
                        msg:'you have input wrong email or password'
                    })
                }
            });
        } else {
            return res.json({
                status:'error',
                msg:'you have input wrong email or password'
            })
        }
    } catch(e){
        return res.json({
            status:'error',
        });
    }
     
}