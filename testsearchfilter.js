const express= require('express');
const {Sequelize, DataTypes, Op} = require('sequelize');
const sequelize = new Sequelize('where_is_your_motivation_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });
const asyncHandler = require('express-async-handler')

  const Folower = sequelize.define('folowers',{
    name:{
        type: DataTypes.STRING,
    },
    age:{
        type: DataTypes.INTEGER,
    }
  });
  const Post = sequelize.define('posts',{
      name:{
          type: DataTypes.STRING,
      },
      hobbie:{
          type: DataTypes.STRING
      }
  });
  const Hater = sequelize.define('haters',{
      nick:{
          type: DataTypes.STRING
      },
      isBad:{
          type: DataTypes.BOOLEAN,
          defaultValue: true
      }
  });

Post.hasMany(Folower);
Post.hasMany(Hater);
 
  (async()=>{try {
     
    await sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
 
})()
const app = express();

app.get('/',asyncHandler(async (req,res,next)=>{
     
    
    
    
     let fields = req.query;

    

    //   let posts = await Post.findAll(createFilter(fields));
    let posts = await Post.findAll(createFilter(fields))
    checkError(posts, Post);
    return res.json({
        status:'ok',
        posts
     });
}));

app.use((error, req, res, next) => { 
    if(error){
        let errorMsg = error.toString().split(':')[1].trim();
        return res.json({
            status:'error',
            msg: errorMsg
        })
    }
})

app.listen(8000,()=>{
    console.log('listening on port 8000');
})
function checkError(items=[], Model){
    if(items.length > 0 && items[0] instanceof Model){
        return true;
    } else {
        throw new Error('empty array');
    }
}

function createFilter(fields){
    const DATA = {
        folower: Folower
    }
    let filterObject = {
        
        include:[]
    };

    
    for(let field in fields){
        if(field.includes(':')){
            let [model, modelField, operation] = field.split(':');
            subFilter(filterObject,field,DATA[model].tableName,fields);
        } else {

        }

    }
    
    return filterObject;
}

function filterContainsModel(filterObject, tableName){
    return filterObject.include.find(el=>el.model.tableName===tableName);

}

function subFilter(filterObject, field, tableName, fields ){
    const DATA = {
        folower: Folower
    }
let [model, modelField, operation] = field.split(':');
    // contains allready
    // not contains
  let findedModel =   filterContainsModel(filterObject,tableName);
     if(findedModel){
        filterObject.include = [...filterObject.include,{
            model: findedModel.model,
            where : {
                [modelField]:fields[field]
            }
        }];
    } else {
        if(operation=='eq'){
            filterObject.include = [{
                model: DATA[model],
                where:{
                    [modelField]: fields[field]
                }
            }];
        } else {
            filterObject.include = [{
                model: DATA[model],
                where:{
                    [Op[operation]]:fields[field].map((itemValue)=>({[modelField]:itemValue}))
                }
            }];
        }
    }
}
