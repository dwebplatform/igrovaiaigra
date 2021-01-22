const Interface = require('interface');
const IServiceInterface = new Interface();
const db = require('../models');

const User = db.users;
const Trener = db.treners;

class UserService  extends IServiceInterface{
    constructor(){
        super();
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
    constructor(){
        super();
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