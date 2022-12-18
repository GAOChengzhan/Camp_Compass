const express = require('express')
const router = express.Router();
const {campgroundSchema} = require('../schema.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,doesExist,validateCampground} = require('../utils/middlewareFunc');


// MAIN ********************************************************************************
router.get('/',catchAsync(async (req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
// MAIN ********************************************************************************
// ADD NEW *****************************************************************************
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn,validateCampground, catchAsync(async (req,res,next)=>{
    // if(!req.body.Campground) throw new ExpressError("Invalid Campground Data",400);
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully created a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));
// ADD NEW ******************************************************************************

// SHOW *********************************************************************************
router.get('/:id',doesExist,catchAsync( async (req,res)=>{
    const campground = req.info;
    res.render('campgrounds/show',{campground});
}));
// SHOW *********************************************************************************

// UPDATE *******************************************************************************
router.get('/:id/edit',doesExist,isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const campground =req.info;
    res.render('campgrounds/edit',{campground});
}));

router.put('/:id',doesExist,isLoggedIn,isAuthor,validateCampground, catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));
// UPDATE *******************************************************************************

// DELETE *******************************************************************************
router.delete('/:id',doesExist,isLoggedIn,isAuthor,catchAsync(async (req,res)=>{
    const {id} =req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrounds');
}));
// DELETE *******************************************************************************

module.exports = router;