var mongoose = require('mongoose');
var Books = mongoose.model('Books');

module.exports.getReviewsByUser = function (req, res) {
    console.log(req.params);
    var username = req.params.username;
    // console.log(username);
    // console.log("GET bookID " + bookID);

    Books
        .aggregate(
        [{$unwind: "$reviews"}, {$match: {$and: [
            {
                "reviews.username" : {$eq: username}
            }
        ]}}])
        .exec(function (err, doc) {
            var thisReview;
            var response = {
                status: 200,
                message: {}
            };
            console.log(doc);
            res
                .status(200)
                .json(doc);
        })
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

module.exports.reviewsUpdateOne = function (req, res) {
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
                    thisReview.username = req.body.username;
                    thisReview.text = req.body.text;
                    thisReview.stars = parseInt(req.body.stars);
                    thisBook.save(function (err, updatedBook) {
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
}

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
