const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard/:userId', userController.getDashboard);
router.get('/session', userController.getUserBySession);


module.exports = router;
