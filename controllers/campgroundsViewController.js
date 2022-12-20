const Campground = require('../models/campground');
const {campgroundSchema} = require('../schema.js');

module.exports.index = async (req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}
module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req,res,next)=>{
    // if(!req.body.Campground) throw new ExpressError("Invalid Campground Data",400);
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully created a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}
module.exports.showCampground =  async (req,res)=>{
    const campground = req.info;
    res.render('campgrounds/show',{campground});
}
module.exports.renderEditForm = async(req,res)=>{
    const campground =req.info;
    res.render('campgrounds/edit',{campground});
}
module.exports.editCampground = async (req,res)=>{
    const {id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteCampground = async (req,res)=>{
    const {id} =req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrounds');
}