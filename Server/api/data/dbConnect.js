var mongoose = require('mongoose');

var dbURL = 'mongodb://127.0.0.1:27017/catalog';

mongoose.connect(dbURL);

mongoose.connection.on('connected', function () {
    console.log("Mongoose connected to " + dbURL);
});
mongoose.connection.on('disconnected', function () {
    console.log("Mongoose disconnected");
});
mongoose.connection.on('error', function (err) {
    console.log("Mongoose connection error " + err);
});

// require('./businesses.model.js');
// require('./potholes.model.js');

require('./books.model.js');

// var MongoClient = require('mongodb').MongoClient;
// var dbURL = 'mongodb://127.0.0.1:27017/businessDB';

// var connection = null;

// module.exports.open = function() {
//     MongoClient.connect(dbURL, function(err, db) {
//         if(err){
//             console.log("DB connection failed" + err);
//             return;
//         }
//         connection = db;
//         console.log("DB connection open");
//     })
// }

// module.exports.get = function() {
//     return connection;
// }
