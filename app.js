if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const dbURL = process.env.DB_URL|| 'mongodb://localhost:3000/yelp-camp';
const express = require('express');
const path = require('path')
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');//ErrorHandler
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');

//flash and Session
const flash = require('connect-flash');//flash
const session = require('express-session');//Session
const helmet = require('helmet');

//Passport
const cookieParser = require('cookie-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User =require('./models/user');

//Routes
const campgroundsRoutes =require('./routes/campground');//campgroundRoutes
const reviewRoutes = require('./routes/review');//reviewRoutes
const userRoutes = require('./routes/user');

const MongoDBStore = require('connect-mongo')(session);

mongoose.connect(dbURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    // useCreateIndex:true,
    // useFindAndModified:false,
}) ;// databaseName:yelp-camp

//connect to mongoose********************************************************************
const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
//connect to mongoose********************************************************************

// Configuation *************************************************************************
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));//serve public assets
app.use(mongoSanitize());
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoDBStore({
    url: dbURL,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
// Configuation *************************************************************************

// EJS **********************************************************************************
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
// EJS **********************************************************************************

// Session & Flash***********************************************************************
// app.use(cookieParser('foo'));
const sessionConfig ={
    store,
    secret: "secret",
    name:"session",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,// Security
        // secure: false,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

// Session & Flash***********************************************************************

// Passport *****************************************************************************
app.use(passport.initialize());//initialize passport
app.use(passport.session());//persistent login sessions
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// Passport *****************************************************************************

//Routes ********************************************************************************
app.use('/',userRoutes);
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
const port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Serving on Port ${port}`)
})