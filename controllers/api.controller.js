// @ts-nocheck
const db = require("../models");

const paginate = require('express-paginate');
// const User = db.users;
const Trener = db.treners;
const Subject = db.subjects;

const Op = db.Sequelize.Op;


const ServiceUtil = require('../utils/serviceUtils');



let serviceUtil = new ServiceUtil(db);


/**
 * @method {"GET"}  
 * @params 
 * @description  получить тренеров и предметы
 */
exports.getTrenersWithSubjects = async (req,res)=>{
  let subjects = await serviceUtil.getAllSubjects();
  let treners  = await serviceUtil.getAllTreners();
  return res.json({
    status:'ok',  
      subjects,
      treners
  });
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.gameWithTreners = async (req,res)=>{
    let  { id } = req.params;
    let game = await serviceUtil.getGameWithTreners(id);
    return res.json({
        status:'ok',
        game
    });
}
/**
 * @method {"GET"}  
 * @params 
 * @description  получить топ 10 игр
 */
exports.getTopGames = async (req,res)=>{
    let topGames = await serviceUtil.getTopGames();
    return res.json({
        status:'ok',
        topGames
    });
}