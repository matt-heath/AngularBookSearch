var express = require('express');
var router = express.Router();
// var businessesController = require('../controllers/businesses.controllers.js')
var reviewsController = require('../controllers/reviews.controllers.js');
var booksController = require('../controllers/books.controllers.js');

router
    .route('/books/:bookID/reviews')
    .get(reviewsController.reviewsGetAll);
    // .post(reviewsController.reviewsAddOne);

router
    .route('/books/:bookID/reviews/:reviewID')
    .get(reviewsController.reviewsGetOne);
    // .put(reviewsController.reviewsUpdateOne)
    // .delete(reviewsController.reviewsDeleteOne);

router
    .route('/books')
    .get(booksController.booksGetAll);
    // .post(booksController.booksAddOne);
router
    .route('/books/:bookID')
    .get(booksController.booksGetOne)
    // .put(booksController.booksUpdateOne);
    .delete(booksController.booksDeleteOne);

module.exports = router;
