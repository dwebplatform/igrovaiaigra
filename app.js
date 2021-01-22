
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("hbs");
const cookieParser = require('cookie-parser');
const expressHbs = require("express-handlebars");
// const jwt = require('jsonwebtoken');
const paginate = require('express-paginate');
const fileUpload = require('express-fileupload');
const passport = require('passport');

const app = express();
app.use(cookieParser());
app.use((req,res,next)=>{
  if(req.cookies.type){ 
    // значит мы создаем instance 
      if(req.cookies.type==='user'){
          req.serviceWorker = {
            msg:'now we have user'
          };
      }
      if(req.cookies.type==='trener'){
          req.serviceWorker = {};
      } 
  }
  next();
});
app.use(paginate.middleware(10, 50));// пагинация страниц
app.use(fileUpload({
    createParentPath: true
}));// для загрузки файлов
app.set('views', __dirname + '/views');

app.engine("hbs", expressHbs(
  {
      layoutsDir: "views/layouts", 
      defaultLayout: "layout",
      extname: "hbs"
  }
))
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");


const db = require("./models");
const userModel = require('./models/user.model');

// связи в БД
const Subject = db.subjects;
const Comment = db.comments;
const Trener = db.treners;
const User = db.users;
Subject.belongsToMany(Trener, { through: 'Trener_Subject' });
Trener.belongsToMany(Subject, { through: 'Trener_Subject' });
Trener.hasMany(Comment);


Comment.belongsTo(Trener);

 (async()=>{

  const subjects = ['Owerwatch','Dota 2','CS : GO','Super Mario'];

  const alltreners =[{
  name:'Jack',
  password:'1234',
  avatar:'img/avatar1.jpg',
  price: 3700
},
{
  name:'Bob',
  password:'1234',
  avatar:'img/avatar2.jpg',
  price: 3700
},
{
  name:'Bob',
  password:'1234',
  avatar:'img/avatar3.jpg',
  price: 3600
}];
alltreners.forEach(async el=>{
   await Trener.create({
    name: el.name,
    password: el.password,
    email:'karpov-vb-1996@mail.ru',
    avatar:el.avatar,
    price: el.price
   });
});
 let subject = await Subject.create({
  name: subjects[1]
 });
 let tr = await Trener.findOne({
  where:{
    id: 1,
  }
 });
 tr.addSubject(subject)
  // let subject = await Subject.findOne({
  //   where:{
  //     id:1
  //   }
  // })
  // let newTrener = await Trener.create({
  //   name:'Yakudza1022',
  //   password:'1234',
  //   email:'karpov-vb-1996@mail.ru'
  // });
   // await newTrener.addSubject(subject);
});
/**
 * connactions 
 */

db.sequelize.sync().catch((e)=>{
    console.log(e)
});

app.use(passport.initialize());

require('./config/passport')(passport);

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.static('./public'));


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @description Подключение роутов
 */
require("./routes/user.routes")(app);
require("./routes/trener.routes")(app);
require("./routes/search.routes")(app);


// simple route 
app.get("/", async (req, res) => {
  let allUsers =  await User.findAll();
         res.json({ message: "Welcome to bezkoder application.", users: allUsers ,service:req.serviceWorker});
});


app.get('/apis', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

  
// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});