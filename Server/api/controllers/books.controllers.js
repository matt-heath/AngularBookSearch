var mongoose = require('mongoose');
var Books = mongoose.model('Books');

var splitArray = function (input) {
    var output;

    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.booksGetAll = function (req, res) {
    var start = 0;
    var number = 5;
    var maxNumber = 10;

    //checks if queryString values are available
    if (req.query && req.query.start) {
        start = parseInt(req.query.start);
    }

    if (req.query && req.query.start) {
        number = parseInt(req.query.number);
    }

    if (req.query && req.query.number) {
        number = parseInt(req.query.number);
    }
    if (isNaN(start) || isNaN(number)) {
        res
            .status(400)
            .json({
                "message":
                    "If supplied in querystring, start and number must be numeric"
            });
        return;
    }

    if (number > maxNumber) {
        res
            .status(400)
            .json({
                "message":
                "Max value for number is " + maxNumber
            });
        return;
    }

    Books
        .find()
        // .skip(start) //skip a number of documents before returning results
        // .limit(number) // max number of docs to be returned
        // .toArray(function (err,docs) {
        //     console.log("Retrieved the businesses");

        //     res
        //         .status(200)
        //         .json(docs);
        // })
        .exec(function (err, docs) {
            console.log(docs);
            if (err) {
                console.log("Error finding books");
                res
                    .status(500)
                    .json(err)
            } else {
                console.log('Retrieved data for ' +
                    docs.length + " books");
                res
                    .status(200)
                    .json(docs);
            }
        })
};

module.exports.booksGetOne = function (req, res) {
    var bookID = req.params.bookID;
    // console.log(req.params);
    console.log("GET Book " + bookID);
    Books
        .findById(bookID)
        .exec(function (err, doc) {
            console.log("Found Book " + bookID);
            var response = {
                status: 200,
                message: doc
            };
            // console.log(response.message);
            if (err) {
                response.status = 500;
                response.message = err
            } else if (!doc) {
                response.status = 404;
                response.message = {
                    "message":
                        "Book ID not found"
                };
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.booksAddOne = function (req, res) {
    console.log(req.body);
    Books
        .create({
            title: req.body.title,
            isbn: req.body.isbn,
            pageCount: req.body.pageCount,
            publishedDate: {
                date: req.body.publishedDate
            },
            thumbnailUrl: req.body.thumbnailUrl,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            status: req.body.status,
            authors: splitArray(req.body.authors),
            categories: splitArray(req.body.categories)

        }, function (err, newBook) {
            if (err) {
                console.log("Error creating book" + err);
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(newBook);

                // Books.SyncToAlgolia();

            }
        });
};

module.exports.booksUpdateOne = function (req, res) {
    // console.log(req.params);
    var bookID = req.params.bookID;

    console.log("GET Book " + bookID);

    // Tank.findByIdAndUpdate(id, { $set: { size: 'large' }}, { new: true }, function (err, tank) {
    //     if (err) return handleError(err);
    //     res.send(tank);
    // });

    Books
        .findById(bookID)
        .exec(function (err, doc) {
            // console.log(doc);
            var response = {
                status: 200,
                message: doc
            };
            if (err) {
                console.log("Error finding book");
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                response.status = 400;
                response.message = {
                    "message": "Book ID not found"
                };
            }
            // console.log("Found Book " +bookID);

            if (response.status != 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {

                doc.title = req.body.title;
                doc.isbn = req.body.isbn;
                doc.pageCount = req.body.pageCount;
                doc.thumbnailUrl = req.body.thumbnailUrl;
                doc.shortDescription = req.body.shortDescription;
                doc.longDescription = req.body.longDescription;
                doc.status = req.body.status;
                doc.authors = splitArray(req.body.authors);
                doc.categories = splitArray(req.body.categories);
                doc.publishedDate = {
                    date: req.body.publishedDate
                };
                console.log(doc);
                doc.save(function (err, updatedBook) {
                    if (err) {
                        res
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });

                // Books.syncWithAlgolia();
                // Books.SyncToAlgolia();
            }
        });
};

// module.exports.booksDeleteOne = function (req, res) {
//     var bookID = req.params.bookID;
//
//     Books
//         .findByIdAndRemove(bookID)
//         .exec(function (err, thisBook) {
//             if (err) {
//                 res
//                     .status(400)
//                     .json(err);
//             } else {
//                 console.log("Book " + bookID + " deleted");
//
//                 // Books.SyncToAlgolia();
//
//                 res
//                     .status(204)
//                     .json();
//             }
//         });
// };

module.exports.booksDeleteOne = function (req, res) {
    var bookID = req.params.bookID;
    console.log(bookID);

    Books
        .findById(bookID)
        .exec(function (err, thisBook) {
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
            }
            //check error and save
            if (response.status !== 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                // thisBook.remove();
                thisBook.remove(function (err, updatedBook) {
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
        })
};


// module.exports.fixDatabase = function(req, res) {
//     Books
//         .find()
//         .exec(function(err, docs) {
//             for (var i = 0; i < docs.length; i++) {
//                 console.log(docs[i]);
//                 books = docs[i];
//                 _id = books._id;
//                 username = books.username;
//                 text = books.text;
//                 stars = books.stars;
//                 Books.updateOne (
//                     { "_id" : _id },
//                     { $set : {
//                         "username" : username,
//                         "text" : text,
//                         "stars" : stars
//                     }
//                     }
//                 );
//             }
//             res
//                 .status(200)
//                 .json({"Message" : "Database updated"});
//         })
// }
