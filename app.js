
const express = require('express');
const verifyToken = require('./utils/verifyToken');
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
// const jwt = require('jsonwebtoken');
const paginate = require('express-paginate');
const app = express();
app.use(paginate.middleware(10, 50));
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

// связи в БД
const Subject = db.subjects;
const Comment = db.comments;
const Trener = db.treners;
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
    name:el.name,
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
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


app.get('/apis', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

 
  
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});