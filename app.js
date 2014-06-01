
/**
 * Module dependencies.
 */

'use strict';

var express = require('express')
,   routes  = require('./routes')
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

app.get('/', routes.index);
app.get('/actor', routes.actor);
app.get('/search', routes.search);
app.get('/stats', routes.stats);
app.get('/np', routes.np);
app.get('/watching', routes.trakt);
app.get('/tmdb', routes.tmdb);
app.get('/quiz', routes.quiz);
app.post('/new', routes.watching);

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
