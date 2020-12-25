// Trener
const verifyToken = require('../utils/verifyToken');

module.exports = (app) => { // роуты для тренеров
    const treners = require('../controllers/trener.controller');
    const router = require("express").Router();
        router.get('/all',treners.allTreners);
        router.get('/:id',treners.trenerById);
        router.post('/login', treners.checkAuthPage);
        router.get('/login', treners.trenerPage);
        router.get('/protectedtreners',verifyToken,treners.trenersProtected);
        router.post('/upload', treners.uploadAction);
        router.get('/dashboard', treners.dashboardPage);
    app.use('/api/treners', router);
  };

   