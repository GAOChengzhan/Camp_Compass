const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully created a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res,next)=>{
    const {id,reviewID}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success','Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`)
}