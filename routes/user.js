const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userVC = require('../controllers/userViewController')

router.route('/register').get(userVC.renderRegister).post(catchAsync(userVC.userRegister));

router.route('/login').get(userVC.renderLogin).post(
    passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),
    userVC.userLogin)

router.get('/logout',userVC.userLogout)
module.exports = router;