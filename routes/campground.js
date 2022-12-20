const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn,isAuthor,doesExist,validateCampground} = 
                    require('../utils/middlewareFunc');
const campgroundsVC = require('../controllers/campgroundsViewController');
const multer = require('multer');
const upload = multer({dest:'uploads/'})

// MAIN ********************************************************************************
router.route('/')
.get(catchAsync(campgroundsVC.index))
.post(upload.array('campground[image]'),(req,res)=>{
    console.log(req.body,req.file);
    res.send("It worked!");
})

// .post(isLoggedIn, validateCampground, catchAsync(campgroundsVC.createCampground));

// ADD NEW *****************************************************************************
router.get('/new',isLoggedIn,campgroundsVC.renderNewForm);

// SHOW *********************************************************************************
router.route('/:id')
.get(doesExist,catchAsync(campgroundsVC.showCampground))
.put(doesExist,isLoggedIn,isAuthor,validateCampground, catchAsync(campgroundsVC.editCampground))
.delete(doesExist,isLoggedIn,isAuthor,catchAsync(campgroundsVC.deleteCampground));
// UPDATE *******************************************************************************
router.get('/:id/edit',doesExist,isLoggedIn,isAuthor,catchAsync(campgroundsVC.renderEditForm));
// Export *******************************************************************************
module.exports = router;