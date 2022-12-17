const express = require('express')
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const {reviewSchema} = require('../schema.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


// Middleware Function*******************************************************************
const validateReview =(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
// Middleware Function*******************************************************************

// Add Review ***************************************************************************
router.post('/',validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
}))
// Add Review ***************************************************************************

// Delete Review ************************************************************************
router.delete('/:reviewID', catchAsync(async(req,res,next)=>{
    const {id,reviewID}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success','Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`)
}))
// Delete Review ************************************************************************

module.exports = router;