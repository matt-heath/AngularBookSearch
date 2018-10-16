// var businesses_data = require('../data/psni-crime-nov-17.json');
// var dbConnect = require('../data/dbConnect.js');
// var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var Business = mongoose.model('Business');
// var businesses_data = require('../data/data_100.json');

var splitArray = function (input) {
    var output;

    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

var runGeoQuery = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: 10000,
        num: 5
    }
    Business
        .geoNear(point, geoOptions,
            function (err, results, stats) {
                // console.log("Geo stats", stats);
                // console.log("GEO RESULTS "+ results);
                // var resultsObject = results.toObject();

                // resultsObject.forEach(element => {
                //     console.log(element._id);
                // });
                // var json = {};
                var arr = [];
                var i ="";
                for(var i in results){
                    console.log(results[i]);
                    // console.log(stats.avgDistance);
                    // console.log(results[i].obj["full_address"]);
                    var json = {
                        'name': results[i].obj["name"],
                        'full_address': results[i].obj["full_address"],
                        'distance' : results[i].dis
                        // 'averageDistance': stats.avgDistance
                    }
                    arr[i] = json;
                    // json = {'distance': results[i].dis}

                    // arr = json;

                    // console.log("ARRAY" + arr);
                }
                // console.log(arr);
                // arr["avgDistance"] = stats.avgDistance;
                var data = {
                    'averageDistance' : stats.avgDistance,
                    'businesses': arr
                }

                res
                    .status(200)
                    .json(data);
            });
}

module.exports.businessesGetAll = function (req, res) {
    // var db = dbConnect;
    // var collection = db.collection('business');

    var start = 0;
    var number = 5;
    var maxNumber = 10;

    if (req.query && req.query.lng && req.query.lat) {
        // console.log("SHIT");
        console.log(req.query.lat);
        runGeoQuery(req, res);
        return;
    }

    //checks if queryString values are available
    // if (req.query && req.query.start) {
    //     start = parseInt(req.query.start);
    // }

    // if(req.query && req.query.start) {
    //     number = parseInt(req.query.number);
    // }

    if (req.query && req.query.number) {
        number = parseInt(req.query.number);
    }
    if (isNaN(start) || isNaN(number)) {
        res
            .status(400)
            .json({
                "message":
                    "If supplied in querystring, start and number must be numeric"});
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

    Business
        .find()
        .skip(start) //skip a number of documents before returning results
        .limit(number) // max number of docs to be returned
        // .toArray(function (err,docs) {
        //     console.log("Retrieved the businesses");

        //     res
        //         .status(200)
        //         .json(docs);
        // })
        .exec(function (err, docs) {
            if (err) {
                console.log("Error finding businesses");
                res
                    .status(500)
                    .json(err)
            }else{
                console.log('Retrieved data for ' +
                            docs.length + " businesses");
                res
                    .status(200)
                    .json(docs);
            }
        });
        
    // console.log("db", db);
    // console.log("GET the businesses");
    // console.log(req.query); // retrieve info from query string

    

    // //slice determines and extracts desired portion of data set and returned using res.json()
    // var returnData = businesses_data.slice(
    //     start,
    //     start+number
    // );

    // res
    //     .status(200)
    //     .json( returnData )
};

module.exports.businessesGetOne = function (req, res) {
    // var db = dbConnect.get();
    // var collection = db.collection('business');
    var businessID = req.params.businessID;
    console.log("GET business " + businessID);
    Business
        .findById(businessID)
        .exec(function (err, doc) {
            console.log("Found business " +businessID);
            var response = {
                status: 200,
                message: doc
            }
            if (err) {
                response.status = 500;
                response.message = err
            } else if (!doc) {
                response.status = 404;
                response.message = {
                "message":
                    "Business ID not found" };
            }
            res
                .status(response.status)
                .json(response.message);
        });
        // .findOne({ _id: ObjectId(businessID) },
        //     function (err, doc) {
        //         res
        //             .status(200)
        //             .json(doc);
        //     })

    // console.log("GET business " + businessID); 

    // res
    //     .status(200)
    //     .json(thisBusiness) // return JSON element as the json() response to the request.
};

module.exports.businessesAddOne = function (req, res) {
    // var db = dbConnect.get();
    // var collection = db.collection('business');
    // console.log("db", db);
    console.log("POST new business");
    // console.log(req.body);

    Business
        .create({
            //new object to be added
            name: req.body.name,
            starts : parseInt(req.body.stars),
            city : req.body.city,
            review_count : 0,
            categories : splitArray(req.body.categories),
            reviews: [],
            location : {
                address: req.body.address,
                coordinates : [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            }
        }, 
        function (err, newBusiness) {
            if(err){
                console.log("Error creating business");
                res
                    .status(400)
                    .json(err);
            } else{
                res
                    .status(201)
                    .json(newBusiness);
            }
        });

    // if (req.body && req.body.name && req.body.stars) {
    
    //     var newBusiness = req.body;
    //     newBusiness.stars = parseInt(req.body.stars);

    //     collection
    //         .insertOne(newBusiness, function (err, response) {
    //             console.log(response);

    //             res
    //                 .status(201)
    //                 .json(response.ops)
    //         });
    // }else{
    //     console.log("Data missing from body");

    //     res    
    //         .status(400)
    //         .json( {message: "Required data missing"});
    // }

    // res
    //     .status(200)
    //     .json(req.body);
};

module.exports.fixDatabase = function (req, res) {
    // var db = dbConnect.get();
    // var collection = db.collection('business');
    collection
        .find()
        .toArray(function (err, docs) {
            for (var i = 0; i < docs.length; i++) {
                business = docs[i];
                _id = business._id;
                full_address = business.full_address;
                longitude = business.longitude;
                latitude = business.latitude;
                collection.updateOne(
                    { "_id": _id },
                    {
                        $set: {
                            "location": {
                                "address": full_address,
                                "coordinates": [
                                    longitude, latitude]
                            }
                        }
                    }
                );
            }
            res
                .status(200)
                .json({ "Message" : "Database updated" });
        })
}

module.exports.businessesUpdateOne = function (req, res) {
    var businessID = req.params.businessID;

    console.log("GET business " + businessID);

    Business
        .findById(businessID)
        .select("reviews")
        .exec(function (err,doc) {
            var response = {
                status: 200,
                message: doc
            }
            if(err){
                console.log("Error finding business")
                response.status = 500;
                response.message = err;
            }else if(!doc){
                response.status = 400;
                response.message = {
                    "message" : "Business ID not found"
                };
            }
            console.log("Found business " +businessID);

            if(response.status != 200){
                res
                    .status(response.status)
                    .json(response.message);
            }else{
                doc.name = req.body.name;
                doc.stars = parseInt(req.body.stars);
                doc.city = req.body.city;
                doc.categories = splitArray(req.body.categories);
                doc.location = {
                    address : req.body.address,
                    coordinates : [
                        parseFloat(req.body.lng),
                        parseFloat(req.body.lat)
                    ]
                };
                doc.save(function (err, updatedBusiness) {
                    if(err){
                        res
                            .status(500)
                            .json(err);
                    }else{
                        res
                            .status(204)
                            .json();
                    };
                });
            };
        });
};

module.exports.businessesDeleteOne = function (req, res) {
    var businessID = req.params.businessID;

    Business
        .findByIdAndRemove(businessID)
        .exec(function (err, thisBusiness) {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                console.log("Business " + businessID + " deleted");

                res
                    .status(204)
                    .json();
            }
        });
}