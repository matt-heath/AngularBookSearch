var express = require('express');
var router = express.Router();
var reviewsController = require('../controllers/reviews.controllers.js');
var booksController = require('../controllers/books.controllers.js');

router
    .route('/books/:bookID/reviews')
    .get(reviewsController.reviewsGetAll);

router
    .route('/books/:bookID/reviews/:reviewID')
    .get(reviewsController.reviewsGetOne);

router
    .route('/books')
    .get(booksController.booksGetAll);

router
    .route('/books/:bookID')
    .get(booksController.booksGetOne)
    .delete(booksController.booksDeleteOne);

module.exports = router;
