
/**
 * Module dependencies.
 */

'use strict';

var express = require('express')
,   index  = require('./lib/routes/index')
,   lastfm  = require('./lib/routes/lastfm')
,   movies  = require('./lib/routes/movies')
,   actor  = require('./lib/routes/actor')
,   http    = require('http')
,   path    = require('path')
,   cors    = require('cors')
,   app     = express();

// all environments
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

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', movies.index);
app.get('/movies', movies.numberOfMovies);
app.get('/actor', actor.actor);
app.get('/cover', index.covers);
app.get('/stats', index.stats);
app.get('/np', index.np);
app.get('/tmdb', index.tmdb);
app.get('/quiz', index.quiz);
app.post('/new', index.watching);
app.post('/lastfm', lastfm.lastfm);

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
