const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken:mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}
module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req,res,next)=>{
    // if(!req.body.Campground) throw new ExpressError("Invalid Campground Data",400);
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // res.sned(geoData.body.features[0].geometry.coordinates);
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f=>({url:f.path,fileName:f.fileName}));
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteCampground = async (req,res)=>{
    const {id} =req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrounds');
}