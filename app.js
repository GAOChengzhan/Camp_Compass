const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const campgroundsRoutes =require('./routes/campground');
const reviewRoutes = require('./routes/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}) ;// databaseName:yelp-camp

//connect to mongoose********************************************************************
const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
//connect to mongoose********************************************************************

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// EJS **********************************************************************************
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
// EJS **********************************************************************************

app.use(express.static('public'))//serve public assets

//Routes ********************************************************************************
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews/',reviewRoutes);
app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404))
})
 
// Error Handler ************************************************************************
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if (!err.message){
        err.message = 'Something went Wrong';
    }
    res.status(statusCode).render('campgrounds/error',{err});
})
// Error Handler ************************************************************************

app.listen(3000,()=>{
    console.log('Serving on Port 3000')
})