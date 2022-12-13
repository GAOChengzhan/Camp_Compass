const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}) ;// databaseName:yelp-camp

//connect to mongoose
const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
    res.render('home')
})

// MAIN ********************************************************************************
app.get('/campgrounds',catchAsync(async (req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));
// MAIN ********************************************************************************

// ADD NEW ******************************************************************************
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', catchAsync(async (req,res,next)=>{
    if(!req.body.Campground) throw new ExpressError("Invalid Campground Data",400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));
// ADD NEW ******************************************************************************

// SHOW *********************************************************************************
app.get('/campgrounds/:id',catchAsync( async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
}));
// SHOW *********************************************************************************

// UPDATE *******************************************************************************
app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}));

app.put('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));
// UPDATE *******************************************************************************

// DELETE *******************************************************************************
app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id} =req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
// DELETE *******************************************************************************


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404))
})
 
// Error Handler ************************************************************************
app.use((err,req,res,next)=>{
    const {message = 'Something went Wrong' ,statusCode = 500} = err;
    res.status(statusCode).render('error');
})
// Error Handler ************************************************************************


// app.get('/makecampground', async (req,res)=>{
//     const camp = new Campground({title:'My Backyard',
//                                 price: '2.2',
//                                 description: 'cheep',
//                                 location: 'California'});
//     await camp.save()  
//     res.send(camp);
// })
app.listen(3000,()=>{
    console.log('Serving on Port 3000')
})