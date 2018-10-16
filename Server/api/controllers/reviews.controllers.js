var mongoose = require('mongoose');
var Books = mongoose.model('Books');
var Reviews = mongoose.model('Reviews');


module.exports.reviewsGetAll = function (req, res) {
    var bookID = req.params.bookID;
    console.log("GET bookID " + bookID);

    Books
        .findById(bookID)
        .select("reviews")
        .exec(function (err, doc) {
            console.log(doc);
            res
                .status(200)
                .json(doc.reviews);
        });
};

module.exports.reviewsGetOne = function (req, res) {
    var bookID = req.params.bookID;
    var reviewID = req.params.reviewID;

    console.log("GET reviewID " + reviewID);

    Books
        .find(
            {'reviews._id': {$eq: reviewID}},
            {reviews:{$elemMatch:{_id: {$eq: reviewID}}}},
            {
                $unwind: '$reviews'
            })
        .exec(function (err, doc) {
            res
                .status(200)
                .json(doc);
            console.log(doc);
        });
};

var addReview = function (req, res, thisBook) {
    thisBook.reviews.push({
        username: req.body.username,
        text: req.body.text,
        stars: parseInt(req.body.stars)
    });
    console.log(thisBook);

    thisBook.save(function (err, updatedBook) {
        console.log("Saving the new book");
        console.log(updatedBook);
        console.log(err);
        var newReviewPosition = updatedBook.reviews.length - 1;
        var newReview = updatedBook.reviews[newReviewPosition];

        updateReviewCount(req, res, updatedBook);
        if (err) {
            res
                .status(500)
                .json(err);
        } else {
            res
            //Send code 201 for a successful post
                .status(201)
                .json(newReview);
        }
    });

};

var updateReviewCount = function (req, res, thisBook) {
    console.log("UPDATED REVIEW COUNT: " + thisBook.reviews.length);

    var reviewsLength = thisBook.reviews.length;
    var bookID = thisBook._id;

    Books.findByIdAndUpdate(bookID, {review_count: reviewsLength}, function (err, doc) {
        if (err) {
            res
                .status(404)
                .json("Reviews not found for Book")
        }
    });
};

module.exports.reviewsAddOne = function (req, res) {
    var bookID = req.params.bookID;
    console.log("GET reviews for book " + bookID);

    Books
        .findById(bookID)
        .select("reviews")
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: []
            };
            console.log(doc);
            if (err) {
                console.log("Error finding book");
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log("Error finding book");
                response.status = 404;
                response.message = {"message": "Book ID not found" + bookID};
            }
            if (doc) {
                console.log("About to add review");
                addReview(req, res, doc);
                Books.SyncToAlgolia();

            } else {
                console.log("Found the Book " + bookID);

                res
                    .status(response.status)
                    .json(response.message);
            }
        });
};

module.exports.reviewsUpdateOne = function (req, res) {
    var bookID = req.params.bookID;
    console.log(req.params);
    var reviewID = req.params.reviewID;

    console.log('PUT reviewID ' + reviewID);

    Books
        .findById(bookID)
        .select('reviews')
        .exec(function (err, thisBook) {

            console.log(thisBook);
            var thisReview;
            var response = {
                status: 200,
                message: {}
            };

            if (err) {
                console.log("Error finding Book");
                response.status = 500;
                response.message = err;
            } else if (!thisBook) {
                console.log("Book ID not found", reviewID);
                response.status = 404;
                response.message = {
                    "message": "Book ID not found " + reviewID
                };
            } else {
                //get review & edit
                console.log(thisReview = thisBook.reviews.id(reviewID));
                if (!thisReview) {
                    response.status = 404;
                    response.message = {
                        "message": "Review ID not found " + reviewID
                    };
                }
                //check error and save
                if (response.status !== 200) {
                    res
                        .status(response.status)
                        .json(response.message);
                } else {
                    // console.log(req.body);
                    thisReview.username = req.body.username;
                    thisReview.text = req.body.review;
                    thisReview.stars = parseInt(req.body.stars);
                    console.log("THISREVIEW " +  thisReview);
                    thisBook.save(function (err, updatedBook) {
                        if (err) {
                            res
                                .status(500)
                                .json(err);
                        } else {
                            // Books.SyncToAlgolia();
                            res
                                .status(200)
                                .json(updatedBook);
                        }
                    });
                }
            }
        });
};

module.exports.reviewsDeleteOne = function (req, res) {
    var bookID = req.params.bookID;
    var reviewID = req.params.reviewID;

    console.log('PUT reviewID ' + reviewID + ' for bookID ' + bookID);

    Books
        .findById(bookID)
        .select('reviews')
        .exec(function (err, thisBook) {
            var thisReview;
            var response = {
                status: 200,
                message: {}
            };

            if (err) {
                console.log("Error finding Book");
                response.status = 500;
                response.message = err;
            } else if (!thisBook) {
                console.log("Book ID not found", id);
                response.status = 404;
                response.message = {
                    "message": "Book ID not found " + id
                };
            } else {
                //get review & edit
                thisReview = thisBook.reviews.id(reviewID);
                if (!thisReview) {
                    response.status = 404;
                    response.message = {
                        "message": "Review ID not found " + reviewID
                    };
                }
                //check error and save
                if (response.status !== 200) {
                    res
                        .status(response.status)
                        .json(response.message);
                } else {
                    thisBook.reviews.id(reviewID).remove();

                    thisBook.save(function (err, updatedBook) {
                        updateReviewCount(req, res, updatedBook);
                        if (err) {
                            res
                                .status(500)
                                .json(err);
                        } else {
                            // Books.SyncToAlgolia();
                            res
                                .status(204)
                                .json();
                        }
                    });
                }
            }
        });
};
