const db = require("../models");
const User = db.users;
const Trener = db.treners;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
<<<<<<< HEAD
 
=======
const jwt = require('jsonwebtoken');


async function checkTrener(email, password, res){
  let trener = await Trener.findOne({
    where: { email }
  });
  if (!trener) {
    return res.json({
      status: 'error',
      msg: 'none auth'
    });
  }
  let originalPassword = trener.password;
  bcrypt.compare(password, originalPassword, function (err, result) {
    if ( err ) {
      return res.json({
        status: 'error',
        msg: 'not matched'
      });
    }
    if (result) {
      let payload = { id: trener.id,type:'trener' };
      jwt.sign(payload, 'kitty_mitty', {}, (err, token) => {
        if (err) return res.json({ status: 'error' });
          res.json({
          success: 'ok',
          // TODO: возвращать токен в нормальном виде
          token: 'Bearer ' + token,
        });
      });

    }

  })
}
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
      let payload = { id: user.id, type: 'user' };
      jwt.sign(payload, 'kitty_mitty', {}, (err, token) => {
        if (err) return res.json({ status: 'error' });
          res.json({
          success: 'ok',
          // TODO возвращать токен в нормальном виде
          token: 'Bearer ' + token,
        });
      });

    }

  })
}



>>>>>>> 8534729cf0cffbeab7665629688fe40898917238

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
 
 

exports.multipleLogin = async (req, res) => {
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
    } else if(type === 'trener'){
      //TODO: make function  
      res.cookie('type','trener');
      checkTrener(email, password, res);
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
} 