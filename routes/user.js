const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register');
})
router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash('success','Registered successfully! Welcome to Camp, '+username+'!');
                res.redirect('/campgrounds');
            }
        })

    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login',
    passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),
    (req,res)=>{
        req.flash('success','Welcome back, '+req.body.username+'!');
        // console.log(req.session);
        const redirectUrl = req.session.returnTo || '/campgrounds';
        
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    })

router.get('/logout',(req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        else{
        req.flash('success',"Logged out successfully!");
        res.redirect('/campgrounds');
        }
    });
    
})
module.exports = router;