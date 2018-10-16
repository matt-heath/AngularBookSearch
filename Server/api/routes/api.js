var express = require('express');
var router = express.Router();
var reviewsController = require('../controllers/reviews.controllers.js');
var booksController = require('../controllers/books.controllers.js');
var profileController = require('../controllers/profile.controllers.js');

router
    .route('/books/:bookID/reviews')
    .post(reviewsController.reviewsAddOne);

// USER PROFILE
router
    .route('/myProfile/:username')
    .get(profileController.getReviewsByUser);

router
    .route('/books/:bookID/reviews/:reviewID')
    .delete(reviewsController.reviewsDeleteOne)
    .put(reviewsController.reviewsUpdateOne);

router
    .route('/books')
    .post(booksController.booksAddOne);

//:businessID identifies variable content.
router
    .route('/books/:bookID')
    .put(booksController.booksUpdateOne);

module.exports = router;
