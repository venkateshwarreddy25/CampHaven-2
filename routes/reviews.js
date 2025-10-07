const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewsController = require('../controllers/reviews');

const { reviewSchema } = require('../schemas.js');
const { islogged, isReviewAuthor } = require('../middleware'); 

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details[0].message, 400);
  } else {
    next();
  }
};

router.post('/', islogged, validateReview, catchAsync(reviewsController.reviewcreate));
router.delete('/:reviewId', islogged, isReviewAuthor, catchAsync(reviewsController.reviewdelete));


module.exports = router;