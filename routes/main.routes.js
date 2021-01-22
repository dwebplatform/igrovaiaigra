module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');
    const apiController = require('../controllers/api.controller');
    const router = require("express").Router();
    // router.get('/',searchController.searchTreners);
    router.get('/',apiController.getTrenersWithSubjects);
    router.get('/game-with-trener/:id', apiController.gameWithTreners);
    router.get('/top-games', apiController.getTopGames);
    // router.get('/subjects', searchController.getAllSubjects);
    app.use('/api/main', router);
  };
