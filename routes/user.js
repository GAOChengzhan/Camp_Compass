const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userVC = require('../controllers/userViewController')

router.get('/register',userVC.renderRegister)
router.post('/register',catchAsync(userVC.userRegister));

router.get('/login',userVC.renderLogin)
router.post('/login',
    passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),
    userVC.userLogin)

router.get('/logout',userVC.userLogout)
module.exports = router;