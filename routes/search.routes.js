// Trener
 
module.exports = (app) => { // роуты для тренеров
    const searchController = require('../controllers/search.controller');
    const router = require("express").Router();
    router.get('/',searchController.searchTreners);
    app.use('/api/search', router);
  };

   