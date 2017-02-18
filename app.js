var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var port     = process.env.PORT || 8180;
var router  = express.Router();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Load the constants
var constants = require('./utils/constants');

//Configure the environment
var config = require('./config/config');

//MongoDB config
require('./config/mongo-config')(mongoose, config, port);

//Load all models here
var db = require('./schemas/main')(mongoose);

//Route prefix here with the version
app.use('/api/' + constants.api_version, router);

app.listen(port, '0.0.0.0', function() {
    console.log('API URI = ' + constants.master_uri);
    console.log('Server running at port ' + port);
});

//Load all services here
require('./routes/user-route')(app, router, db, constants);
require('./routes/scholarship-route')(app, router, db, constants);
require('./routes/application-route')(app, router, db, constants);

module.exports = app;
