// const db = require("../models");
// const Trener = db.treners;

class ServiceUtils {
    constructor(db){
        this.db = db;
    }



    async getGameWithTreners(id){
        if(typeof id === 'undefined'){
            return null;
        }
        try {
             
            let trenerModel =this.db.treners;
            let game = await this.db.subjects.findOne({
                include:[{
                    model: trenerModel,
                    attributes:{
                        exclude:['password']
                    }
                }],
                where:{id}
            });
            return game;
        } catch(e){
            return null;
        }
    }
    /**
     * получить топ 10 игр
     */
    async getTopGames(limit = 10){
        try{
            let games = await this.db.subjects.findAll({
                order:[
                    ['record','DESC']
                ],
                limit     
            });
            return games;
        } catch (e){
            return [];
        }
    }
    /**
     *@description get all subjects
     */
    async getAllSubjects(){
        try {
            let allSubjects = await this.db.subjects.findAll({});
            return allSubjects;
        } catch(e){
            return [];
        }
    }
    /**
     *@description get all treners
     */    
    async getAllTreners(){
        try {
            let allTreners = await this.db.treners.findAll({
                attributes:{
                    exclude:['password']
                }
            });
            return allTreners;
        } catch(e){
            return [];
        }

    }
}
module.exports = ServiceUtils;