const express = require('express')
const router = express.Router();
const {campgroundSchema} = require('../schema.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

// Middleware Function******************************************************************
const validateCampground =(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

// Middleware Function******************************************************************

// MAIN ********************************************************************************
router.get('/',catchAsync(async (req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
// MAIN ********************************************************************************
// ADD NEW *****************************************************************************
router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req,res,next)=>{
    // if(!req.body.Campground) throw new ExpressError("Invalid Campground Data",400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));
// ADD NEW ******************************************************************************

// SHOW *********************************************************************************
router.get('/:id',catchAsync( async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show',{campground});
}));
// SHOW *********************************************************************************

// UPDATE *******************************************************************************
router.get('/:id/edit',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}));

router.put('/:id',validateCampground, catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));
// UPDATE *******************************************************************************

// DELETE *******************************************************************************
router.delete('/:id',catchAsync(async (req,res)=>{
    const {id} =req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
// DELETE *******************************************************************************

module.exports = router;