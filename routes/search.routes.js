// Trener
module.exports = (app) => { // роуты для тренеров
    const searchController = require('../controllers/search.controller');
    const router = require("express").Router();
    router.get('/',searchController.searchTreners);
    router.get('/subjects', searchController.getAllSubjects);
    app.use('/api/search', router);
  };
