
/**
 * Module dependencies.
 */

'use strict';

var express = require('express');
var index   = require('./lib/routes/index');
var lastfm  = require('./lib/routes/lastfm');
var movies  = require('./lib/routes/movies');
var actor   = require('./lib/routes/actor');
var stats   = require('./lib/routes/stats');
var best   = require('./lib/routes/bestFromYear');
var http    = require('http');
var path    = require('path');
var cors    = require('cors');
var dotenv = require('dotenv');

// Load environment variables
dotenv._getKeysAndValuesFromEnvFilePath('./env/.env');
dotenv._setEnvs();

var app     = express();
var server  = http.createServer(app);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cors());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

app.get('/', movies.index);
app.get('/movies', movies.numberOfMovies);
app.get('/actor', actor.actor);
app.get('/cover', index.covers);
app.get('/stats', stats.stats);
app.get('/best', best.bestFromYear);
app.get('/best/:year', best.bestFromYear);
app.get('/np', index.np);
app.get('/tmdb', index.tmdb);
app.post('/new', index.watching);
app.post('/lastfm', lastfm.lastfm);

module.exports = app;

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});