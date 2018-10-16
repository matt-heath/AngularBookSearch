require('./api/data/dbConnect.js');
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
var bodyParser = require('body-parser');
var routes = require('./api/routes/index');
var path = require('path');
var cors = require('cors');
var apiRoutes = require('./api/routes/api');
app.set('port', 3000);
app.use(cors());

// app.use (function (req, res, next) {
//     console.log(req.method, req.url);
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://com644-matthew.eu.auth0.com/.well-known/jwks.json`
    }),
    aud: 'https://learn-a-lot-books/',
    issuer: `https://com644-matthew.eu.auth0.com/`,
    algorithms: ['RS256']
});

//static route created by express.static()
app.use(express.static(path.join( __dirname, 'public')));

// app.use('/api', routes);
app.use('/api', routes);
app.use('/api',checkJwt, apiRoutes);


var server = app.listen(app.get('port'), function () {
    var port = server.address().port;

    console.log("Express listening on port " + port);
});


var host = server.address().address;
console.log("Starting " + server.address().address);
