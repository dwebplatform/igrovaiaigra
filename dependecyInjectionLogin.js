// @ts-nocheck
const cookieParser = require('cookie-parser');
const express =require('express');
const app = express();
 const Interface = require('interface');

const ServiceInterface = new Interface('getItems');

class UserService extends ServiceInterface {
    constructor(){
        super();
    }

    getItems(){
        return [
            {
                id:1,
                name:'Sam',
                type:'from user'
            },
            {
                id:2,
                name:'John',
                type:'from user'
            }
        ]
    }
}
class TrenerService extends ServiceInterface {
    constructor(){
        super();
    }
    getItems(){
        return [
            {
                id:1,
                name:'Sam',
                type:'from trener'
            },
            {
                id:2,
                name:'John',
                type:'from trener'
            }
        ]
    }
}

 
 
app.use(cookieParser('secret_word'))

app.use((req,res,next)=>{
    if(req.cookies.type){
        if(req.cookies.type=='user'){
            req.serviceWorker = new UserService();
        }
        if(req.cookies.type=='trener'){
            req.serviceWorker = new TrenerService();
        }
    }
     next();
})
app.get('/login',(req,res)=>{
    const {email,password, type } = req.query;
    if(type === 'user'){
        res.cookie('type','user');
         //TODO: вернуть токен для user
         return res.json({
            status: 'ok',
            msg: 'user service now available'
        });
    } 
    if(type === 'trener'){
        res.cookie('type','trener');
       
         //TODO: вернуть токен для trener
        return res.json({
            status: 'ok',
            msg: 'trener service now available'
        });
    }
    return res.json({
        status:'error'
    })
})
function checkAuth(req,res,next){
    if(req.cookies.type==='user'){
        if(req.query.password==='user_pass1234'){
            next();
        } else {
            return res.json({
                status:'error',
                msg:'user not authorized'
            });

        }
    }
    if(req.cookies.type === 'trener'){
        if(req.query.password==='trener_pass1234'){
                next();
        } else {
            return res.json({
                status:'error',
                msg:'trener not authorized'
            })
        }
    }
    return res.json({
        status:'error',
        msg:'not allowed'
    });
}
app.get('/check-service',checkAuth,(req,res)=>{
    try{

        let items = req.serviceUtilContainer.getItems();
        return res.json(items);
    } catch(e){
        return res.json({
            status:'error'
        })
    }
   
})
app.listen(8000,()=>{
    console.log('listening on port 8000')
});

