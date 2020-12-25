const db = require("../models");

const paginate = require('express-paginate');
// const User = db.users;
const Trener = db.treners;
const Subject = db.subjects;
const Op = db.Sequelize.Op;
/**
 * 
 * @method {"GET"}  
 * @params 
 * @description  фильтр тренеров по цене дисциплине в которой преподает и тд  
 */
exports.searchTreners = async (req,res)=>{ // находим тренеров у которых есть такой предмет
    let searchedTrenerObj = {
    };
    searchedTrenerObj.attributes = {
        exclude:['password']
    };// чтобы не отображался пароль
    let subjectId = req.query.subjectId;
    let priceFrom = req.query.priceFrom;
    let priceTo = req.query.priceTo;
    
    if(subjectId){ // если есть это поле то ищет по конкретной категории
        searchedTrenerObj.include = {
            ...searchedTrenerObj.include,
            model: Subject,
            where:{
                id: subjectId
            }
        }
    } 
    if(priceFrom){ // если есть это поле то ищет по цене больше заданной
        searchedTrenerObj.where = {
            ...searchedTrenerObj.where,
            price: {
                [Op.gte]:priceFrom
            }
        }   
    }
    if(priceTo){ // если есть это поле то ищет по цене меньше заданной
        searchedTrenerObj.where = {
            ...searchedTrenerObj.where,
            price: {
                [Op.lte]:priceTo
            }
        }   
    }
    // пагинация использовать метод findAndCountAll
    let allTreners = await Trener.findAndCountAll({...searchedTrenerObj,
        limit: req.query.limit,
        offset: req.skip
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
}