const express = require('express')
const router = express.Router({mergeParams:true});
const {validateReview,isLoggedIn,isReviewAuthor} = require('../utils/middlewareFunc')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviewsVC = require('../controllers/reviewsViewController');

// Add Review ***************************************************************************
router.post('/',isLoggedIn,validateReview,catchAsync(reviewsVC.createReview))

// Delete Review ************************************************************************
router.delete('/:reviewID', isLoggedIn,isReviewAuthor,catchAsync(reviewsVC.deleteReview))

// Export Review ************************************************************************
module.exports = router;