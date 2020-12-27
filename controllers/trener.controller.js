const db = require("../models");
const Trener = db.treners;
const Subject = db.subjects;
const Comment = db.comments;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');

const uploadFile = require('../utils/uploadFile');

const upload = uploadFile('myImage');

/**
 * 
 * @method {"GET"}  
 * @desctiprion найти конкретного тренера /:id
 */
exports.trenerById = async(req,res)=>{
    try{
        let trener = await Trener.findOne({
        where:{
            id: req.params.id
        },
        attributes:{
            exclude: ['password']
        }
    });
    return res.json({
        status:'ok',
        body: trener
    })
} catch(e){
    return res.json({
        status:'error'
    });
}
}
/**
 * 
 * @method {"GET"} 
 * @description get all treners 
 */
exports.allTreners = async (req,res)=>{
   try{
  
    let allTreners = await Trener.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        include:[{
          model: Subject,
        },
        {
          model: Comment
        }],
        attributes:{
          exclude:['password']
        }

    });
    const itemCount = allTreners.count;
    const pageCount = Math.ceil(allTreners.count / req.query.limit);
    if(allTreners) {
        return res.json({
            status:'ok',
            body: allTreners,
            itemCount,
            pageCount
        });
    } else {
        return res.json({
            status:'error'
        })
    }
    // let allTreners = await Trener.findAll({
    //     attributes: 
    //     {
    //         exclude: ['password']
    //     }
    // });
    // return res.json({
    //     body: allTreners
    // });

   } catch(e){

       return res.json({
           status:'error',
       })
   }
 }
/**
 * 
 * @method {"POST"} 
 * @description загрузка файла
 */
exports.uploadAction =(req, res)=>{
   try{
    upload(req,res,(err)=>{
        if(err){
           return res.json({
               status:'error',
               msg:err
           });
        } else {
            console.log(req.file);
            res.send('test');
        }
    });
   }  catch(e){
    console.log(e)
   }
     
     
}
exports.dashboardPage= (req,res)=>{
    return res.render('trenerdashboard');
    
}

/**
 * @method {"GET"}  
 * @param {*} res 
 * @description страница авторизации тренеров
 */
exports.trenerPage = (req,res)=>{
    return res.render('trenerpage', {
        email: '',
        password: ''
    });
}

/**
 * @method {"POST"}
 * @params {password:string, email: string}
 * @description  логин тренеров
 */
exports.checkAuthPage = async (req,res)=>{
    let { password, email} = req.body;
    try{
        let trener = await Trener.findOne({
            where:{
                email: email.trim()
            }
        });
        if(trener instanceof Trener){
            let hashedPass = trener.password;
            bcrypt.compare(password, hashedPass, function(err, result) {
                 if(err){
                    return res.json({
                        status:'error'
                    });
                }
                if(result){
                    jwt.sign({trener:{
                      id:trener.id,
                      email: trener.email,
                      password: trener.password
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
                        type:'trener'
                      });
                    });
                } else {
                    return res.json({
                        status:'error',
                        msg:'you have input wrong email or password'
                    });
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
}
/**
 *@method {"GET"} 
 *@authorization 
 */
exports.trenersProtected = (req, res)=>{
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
          res.sendStatus(403);
        } else {
         return res.json({
            status: 'ok',
            msg: 'now trener may see this page',
            authData
          });
        }
      });   
}