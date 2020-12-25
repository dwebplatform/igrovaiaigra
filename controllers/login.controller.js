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
 * @method {"POST"} req 
 * @param {password, email} 
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
                        status:'error'
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
                        token
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
        console.log(e);
        return res.json({
            status:'error'
        })
    }
     
     
    // let hash = bcrypt.hashSync(password, salt);
    // if(hash){
      
         
    //     // if(user instanceof User){
    //     //     return res.json({
    //     //         status:'ok',
    //     //         message:'created'
    //     //     })
    //     // }
    // }   
    
}