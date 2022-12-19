const express = require('express')
const router = express.Router();
const {campgroundSchema} = require('../schema.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,doesExist,validateCampground} = 
                    require('../utils/middlewareFunc');
const campgroundsVC = require('../controllers/campgroundsViewController');
// MAIN ********************************************************************************
router.get('/',catchAsync(campgroundsVC.index));

// ADD NEW *****************************************************************************
router.get('/new',isLoggedIn,campgroundsVC.renderNewForm);
router.post('/', isLoggedIn,validateCampground, 
            catchAsync(campgroundsVC.createCampground));

// SHOW *********************************************************************************
router.get('/:id',doesExist,catchAsync(campgroundsVC.showCampground));

// UPDATE *******************************************************************************
router.get('/:id/edit',doesExist,isLoggedIn,
            isAuthor,catchAsync(campgroundsVC.renderEditForm));

router.put('/:id',doesExist,isLoggedIn,isAuthor,
            validateCampground, catchAsync(campgroundsVC.editCampground));

// DELETE *******************************************************************************
router.delete('/:id',doesExist,isLoggedIn,isAuthor,
                catchAsync(campgroundsVC.deleteCampground));
// Export *******************************************************************************
module.exports = router;