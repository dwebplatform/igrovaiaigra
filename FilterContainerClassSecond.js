const express = require('express');
const faker = require('faker')
const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize('where_is_your_motivation_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
const asyncHandler = require('express-async-handler');
const { times, random, find } = require('lodash');
const { time } = require('faker');

const Folower = sequelize.define('folowers', {
    name: {
        type: DataTypes.STRING,
    },
    age: {
        type: DataTypes.INTEGER,
    }
});
const Post = sequelize.define('posts', {
    name: {
        type: DataTypes.STRING,
    },
    hobbie: {
        type: DataTypes.STRING
    }
});
const Hater = sequelize.define('haters', {
    nick: {
        type: DataTypes.STRING
    },
    isBad: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

Post.hasMany(Folower);
Post.hasMany(Hater);






(async () => {
    try {
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

})()
const app = express();




class FilterContainer {
      DATA = {
        folower : Folower,
        hater : Hater
    }
    filterObject = {
        include:[]
    };
    constructor(fields){
        this.fields = fields;
    }
    /**
     * 
     * @param {"string"} model 
     * @returns filterObject.include[finded_index]| null
     */
      isModelIncludes(model){ 
          let filterParam = this.DATA[model].tableName;
        const modelElement = this.filterObject.include.find((el)=>el.model.tableName === filterParam);
        return modelElement;
        if(  modelElement ){
            return modelElement;
        } else {
            return null;
        }
    }
    firstLevelFilterWithComma(field){
        const [realField, operation] = field.split(',');
        if(operation === 'gt' || operation === 'lt' || operation === 'gte' || operation === 'lte' ){
           if(this.filterObject.where && this.filterObject.where[realField]){ // попадалось
            this.filterObject.where[realField] = {
                ...this.filterObject.where[realField],
                [operation]:this.fields[field]
            }
           }  else { // не попадалось
            this.filterObject.where = {
                ...this.filterObject.where,
                 [realField]:{
                    [operation]: this.fields[field]
                }
            }
           }
        }
    }
    basicFirstLevelFilter(field){
        if(!this.filterObject.where ){ // поле попалось в первый раз
            this.filterObject.where = {
                    [field]:this.fields[field]
            }
        } else { // новое поле
            this.filterObject.where = {
                ...this.filterObject.where,
                [field]:this.fields[field]
            }
    }
}
    firstLevelFilter(field){
        if(field.includes(',')){ // сложный случай
            this.firstLevelFilterWithComma(field);
        } else {
             this.basicFirstLevelFilter(field);
        }
          
    }
    secondLevelFilterAlreadyThereCase(indexOfModel,realField,field,operation){
        if(operation ==='eq'){
            this.filterObject.include[indexOfModel] = {
                ...this.filterObject.include[indexOfModel],
                where : {
                    ...this.filterObject.include[indexOfModel].where,
                    [realField]: this.fields[field]
                }
            };  
        } else if(operation == 'gt' || operation == 'lt'){ 
            if(this.filterObject.include[indexOfModel].where && this.filterObject.include[indexOfModel].where[realField] ){ // попадалась 
                this.filterObject.include[indexOfModel].where ={
                    ...this.filterObject.include[indexOfModel].where,
                    [realField]:{
                        ...this.filterObject.include[indexOfModel].where[realField],
                        [operation]:this.fields[field]
                    }
                }
            } else { // не попадалась
                this.filterObject.include[indexOfModel].where = {
                    ...this.filterObject.include[indexOfModel].where,
                    [realField]:{
                        [operation]:this.fields[field]
                    }
                }
            }

        }
        
    }
    secondLevelFilter(field){
        const [ model, realField, operation ] = field.split(':');
         const modelElement = this.filterObject.include.find((el)=>el.model.tableName === this.DATA[model].tableName);
         if(modelElement){ // если модель уже попадала в фильтр
            let indexOfModel = this.filterObject.include.findIndex((el)=>modelElement);
            this.secondLevelFilterAlreadyThereCase( indexOfModel, realField, field, operation);
          } else { // если модель не попадалась в фильтр
             if( operation === 'eq' ) {
                 this.filterObject.include = [...this.filterObject.include, {
                    model : this.DATA[model],
                    where : {
                        ...this.filterObject.include.where,
                        [realField]:this.fields[field]
                    } 
                }];
             } else if(operation === 'gt' ||operation === 'lt'){
                 this.filterObject.include = [...this.filterObject.include, {
                    model : this.DATA[model],
                    where : {
                        ...this.filterObject.include.where,
                        [realField] : {
                            [operation]: this.fields[field]
                        }
                    } 
                }];
             }
             
        }
    }
    getFilter(){
        for(let field in this.fields){
            if(field.includes(':')){ // второй слой
                this.secondLevelFilter(field);
            } else { // первый слой
                this.firstLevelFilter(field);
            }
        }
        return this.filterObject;
    }

}

app.get('/', asyncHandler(async (req, res, next) => {


    let fields = req.query;
    // let posts = await Post.findAll(makeFilter(fields));
    const myFilter = new FilterContainer(fields);
    return res.json({
        getFilter: myFilter.getFilter()
    })
    // return res.json(makeFilter(fields));
     checkError(posts, Post);
    return res.json({
        status: 'ok',
        posts
    });
}));

app.use((error, req, res, next) => {
    if (error) {
        let errorMsg = error.toString().split(':')[1].trim();
        return res.json({
            status: 'error',
            msg: errorMsg
        })
    }
})

app.listen(8000, () => {
    console.log('listening on port 8000');
})
function checkError(items = [], Model) {
    if (items.length > 0 && items[0] instanceof Model) {
        return true;
    } else {
        throw new Error('empty array');
    }
}


 
function makeFilter(fields){
    const filterObject = {};
    // будет первый уровень вложенности и второй (include)
    for(let field in fields){
        if(field.includes(':')){ // второй уровень вложенности
        } else { // первый уровень вложенности
            // firstLevelFilter(field);
            if(! filterObject.where ){ // поле попалось в первый раз
                filterObject.where = {
                        [field]:fields[field]
                }
            } else {// новое поле
                filterObject.where = {
                    ...filterObject.where,
                    [field]:fields[field]
                }
            }
        }
    }
    return filterObject;
}

 
 
