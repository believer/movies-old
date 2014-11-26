'use strict';

/*
 * GET home page.
 */

var movee       = require('../utils/movee');
var request     = require('request');

var tmdbBaseUrl = 'http://api.themoviedb.org/3/movie/';
var tmdbKey     = process.env.TMDB_KEY;
var BASEURL     = process.env.BASE_URL;
var traktKey    = process.env.TRAKT_KEY;
var traktUrl    = 'http://api.trakt.tv/user/watching.json/{key}/believer';

exports.covers = function (imdb, callback) {
  if (imdb) {
    request({
      url: tmdbBaseUrl + imdb + '/images?api_key=' + tmdbKey,
      headers: {'Accept': 'application/json'},
      method: 'GET'
    }, function (error, response, body) {
      if (!error && body) {
        var movie = JSON.parse(body);

        if (movie && movie.posters && movie.posters.length) {
          var poster = {
            img: 'http://image.tmdb.org/t/p/w500' + movie.posters[0].file_path
          };
          
          return callback(poster);
        }
      }
    });

  } else {
    return {};
  }
};

exports.np = function(req,res) {
  var render  = req.query.render === 'true' ? true : false;
  var BASEURL = process.env.BASE_URL;

  request(traktUrl.replace('{key}',traktKey),function (err, response, body) {
    body = JSON.parse(body);
    var movie = body.movie;

    if (movie) {
      // Get cast and crew from TMDb
      request(BASEURL + '/tmdb?imdbid=' + movie.imdb_id, function (err, response, cast) {
        var people = JSON.parse(cast);

        movie.cast = people.cast;
        movie.crew = people.crew;

        if (!render) {
          res.render('watching', {
            movie: movie
          });
        } else {
          res.send(movie);
        }
      });
    } else {
      res.send({});
    }
  });
};

exports.tmdb = function(req,res) {
  var tmdb_url = tmdbBaseUrl + '{query}/casts?api_key={key}';
  var query    = req.query;
  var url      = tmdb_url.replace('{query}', query.imdbid).replace('{key}',tmdbKey);

  request({ uri: url, headers: {'Accept': 'application/json'} },function (err, response, body) {
    res.send(body);
  });
};

exports.watching = function(req, res) {
  var BASEURL = process.env.BASE_URL;
  
  request(BASEURL + '/np?render=true',function (err, response, body) {

    var nowWatching = JSON.parse(body)
    ,   cast        = nowWatching.cast
    ,   crew        = nowWatching.crew
    ,   extraCast   = req.body.extraCast.length ? req.body.extraCast : ''
    ,   rating      = req.body.rating ? parseInt(req.body.rating, 10) : 0
    ,   wilhelm     = nowWatching.wilhelm ? true : false;

    var myMovie = {
      title: nowWatching.title,
      date: new Date().toISOString(),
      year: nowWatching.year,
      desc: nowWatching.overview,
      imdb: 'http://www.imdb.com/' + nowWatching.imdb_id,
      rating: rating,
      img: '',
      runtime: nowWatching.runtime,
      imdbid: nowWatching.imdb_id,
      cast: [],
      music: [],
      writer: [],
      poster: nowWatching.images.poster || '',
      genres: nowWatching.genres,
      certification: nowWatching.certification,
      tagline: nowWatching.tagline,
      wilhelm: wilhelm,
      director: []
    };

    // Add cast
    cast.forEach(function (actor) {
      myMovie.cast.push(actor.name);
    });

    extraCast
      .split(',')
      .forEach(function (actor) {
        if (!actor.length) { return; }
        myMovie.cast.push(actor.trim());
      });

    // Add crew
    crew.forEach(function (person) {
      var crewType = movee.getCrew(person.job);
      if (crewType) { myMovie[crewType].push(person.name); }
    });

    console.log(myMovie);

    movee.mongoConnect(function (er, collection) {
      collection.find().sort({_id:-1}).limit(1).toArray(function (error, latest) {
        console.log(error,latest);
        myMovie.id  = parseInt(latest[0].id, 10) + 1;
        myMovie.num = parseInt(latest[0].num, 10) + 1;

        collection.insert(myMovie, function(err, inserted) {
          console.log('error', error);
          console.log('inserted', inserted);
        });

        res.redirect('/');
      });
    });
  });
};

exports.quiz = function (req,res) {
  movee.mongoConnect(function (err, collection) {
    collection.find({tagline:{'$not':{'$size':0},$exists: true}}).toArray(function(error, movies) {

      movies = movies.filter(function (movie) {
        return movie.tagline !== '';
      });

      var random       = movee.randomIntFromInterval(0, movies.length)
      ,   randomMovie  = movies[random]
      ,   alternatives = [];

      alternatives.push(randomMovie.title);

      movee.mongoConnect(function (err, collection) {
        collection.find().toArray(function(error, all) {
          for (var i = 0; i < 3; i++) {
            var randAlternative = movee.randomIntFromInterval(0, all.length);
            var alt = all[randAlternative];

            if (alt) {
              alternatives.push(alt.title);
            }
          }

          alternatives = movee.shuffleArray(alternatives);

          res.render('quiz', { movie:randomMovie, alternatives:alternatives });
        });
      });
    });
  });
};

