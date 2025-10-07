const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds=require('../controllers/campgrounds')
const { campgroundSchema } = require('../schemas.js');
const {islogged,isAuthor,validateCampground,isReviewAuthor}=require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary/cloud')

const upload = multer({storage});
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


router.route('/')
        .get(catchAsync(campgrounds.index))
        .post(islogged,upload.array('image'),validateCampground,catchAsync(campgrounds.createcampground))

router.get('/new', islogged,campgrounds.rendernewform)
router.route('/:id')
        .get(catchAsync(campgrounds.showcampground))
        .put( islogged,isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.updatecampground))
        .delete(islogged,isAuthor,isReviewAuthor, catchAsync(campgrounds.deletecampground))

router.get('/:id/edit',islogged,isAuthor, catchAsync(campgrounds.rendereditform))
module.exports = router;

