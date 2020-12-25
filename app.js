
const express = require('express');
const verifyToken = require('./utils/verifyToken');
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
// const jwt = require('jsonwebtoken');
const app = express();

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
const Trener = db.treners;
Subject.belongsToMany(Trener, { through: 'Trener_Subject' });
Trener.belongsToMany(Subject, { through: 'Trener_Subject' });
//  (async()=>{
//   let subject = await Subject.findOne({
//     where:{
//       id:3
//     }
//   })
//   let newTrener = await Trener.create({
//     name:'Yakudza1022',
//     password:'1234',
//     email:'karpov-vb-1996@mail.ru'
//   });
//    await newTrener.addSubject(subject);
// })();
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