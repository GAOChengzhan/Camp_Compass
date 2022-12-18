const Campground = require('../models/campground');
const {campgroundSchema,reviewSchema} = require('../schema.js');
const ExpressError = require('./ExpressError');
// Middleware Function******************************************************************
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;//store to session
        req.session.save();
        console.log(req.session);
        req.flash('error','Please sign in first!');
        return res.redirect('/login');
    }
    next();
}


module.exports.validateCampground =(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You are not allowed to do that!')
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.doesExist = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error','Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    req.info=campground;
    next();
}

module.exports.validateReview =(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}
// Middleware Function******************************************************************