'use strict';

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var path       = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var port = process.env.PORT || 3000;
var router;

//
// Index
// --------------------------------------------------
router = express.Router();
var index = require('./lib/routes/index');
app.use('/', router.get('/', index));

//
// Resources
// --------------------------------------------------
router = express.Router();
var stats = require('./lib/routes/stats');
app.use('/stats', router.get('/', stats));

//
// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
