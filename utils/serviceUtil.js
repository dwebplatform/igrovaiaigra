const Interface = require('interface');
const IServiceInterface = new Interface('getSubjects','getAll');
const db = require('../models');

const User = db.users;
const Trener = db.treners;

class UserService  extends IServiceInterface{
    constructor(id){
        super();
        this.id = id;

    }


    async getSubjects(){
        return [{
            id:this.id,
            name:'subject 1'
        }];        
    }
    async getAll(){
        try {
            let allusers = await User.findAll();
            return allusers;
        } catch(e){
            return [];
        }
    }
}

class TrenerService extends IServiceInterface {
    constructor(id){
        super();
        this.id = id;
    }
    async getSubjects(){
        // находим для текущего тренера предметы
          return [{
            id:this.id,
            name:'subject for trener'
        }];        
    }
    async getAll(){
        try {
            let alltreners = await Trener.findAll();
            return alltreners;
        } catch(e){
            return [];
        }
    }
}

module.exports = {
    UserService,
    TrenerService
}