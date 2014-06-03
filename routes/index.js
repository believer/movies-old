
/*
 * GET home page.
 */

var movee   = require('./movee-utils')
,   request = require('request');

var tmdbBaseUrl = 'http://api.themoviedb.org/3/movie/'
,   tmdbKey     = 'f714b68eea27249e2d7b857433dc2b50';

/**
 * Gets all movies from db
 * @param  {obj} req 
 * @param  {obj} res 
 */
exports.index = function(req, res) {

  'use strict';

  var skip = parseInt(req.query.skip, 10) || 0;

  movee.mongoConnect(function (err, collection) {
    collection.find().sort({date:-1}).skip(skip).limit(1).toArray(function(error, movies) {

      var movie = movies[0];
      var imdb = movie.imdbid || '';

      request('http://localhost:3000/cover?imdb=' + imdb,
        function (err, response, poster) {
          movie.poster = JSON.parse(poster);
          movie.shortDesc = movie.desc ? movee.truncate(movie.desc, 160) : '';
          movie.skip = skip;

          res.render('index', { movie:movie });
          // res.send(movie);
        });
    });
  });
};

exports.numberOfMovies = function (req, res) {
  'use strict';

  var skip = parseInt(req.query.skip, 10) || 0;
  var limit = parseInt(req.query.limit, 10) || 50;

  movee.mongoConnect(function (err, collection) {
    collection.find().sort({date:-1}).skip(skip).limit(limit).toArray(function(error, movies) {
      var send = {
        resultCount: movies.length,
        results: movies
      };

      res.send(send);
    });
  });
};

exports.covers = function (req, res) {
  'use strict';

  var id = req.query.imdb;

  console.log(id);

  if (id) {
    request({
      url: tmdbBaseUrl + id + '/images?api_key=' + tmdbKey,
      headers: {'Accept': 'application/json'},
      method: 'GET'
    }, function (error, response, body) {
      if (!error && body) {
        var movie = JSON.parse(body);

        if (movie.posters.length) {
          var poster = {
            img: 'http://image.tmdb.org/t/p/w500' + movie.posters[0].file_path
          };
          
          res.send(poster);
        }
      }
    });
  } else {
    res.send({});
  }
};

/**
 * Find an actor by name
 * @param  {obj} req
 * @param  {obj} res
 */
exports.actor = function(req, res) {
 
  'use strict';

  var name = req.query.name;

  movee.mongoConnect(function (er, collection) {
    collection.find({ cast: { $regex:name, $options:'i' } }).sort({date:-1}).toArray(function(error, movies) {
      res.render('actor', { movies:movies, actor:name } );
    });
  });
};

/**
 * Search movie title
 * @param  {obj} req
 * @param  {obj} res
 */
exports.search = function(req, res) {

  'use strict';

  var search = req.query.title;

  movee.mongoConnect(function (er, collection) {
    collection.find({ title: { $regex:search, $options:'i' } }).sort({date:-1}).limit(100).toArray(function(error, movies) {
      res.send(movies);
    });
  });
};

/**
 * Gets all movies from db
 * @param  {obj} req 
 * @param  {obj} res 
 */
exports.stats = function(req, res) {

  'use strict';

  var stats = {
    time: {
      minutes: 0
    },
    numbers: {},
    actors: [],
    directors: [],
    composers: [],
    ratings: [0,0,0,0,0,0,0,0,0,0],
    ratingPlaytime: [0,0,0,0,0,0,0,0,0,0],
    genres: [],
    years: {},
    certifications: {},
    wilhelms: 0
  };

  movee.mongoConnect(function (er, collection) {
    collection.find().sort({date:-1}).toArray(function(error, movies) {

      stats.total = movies.length;

      movies.map(function (movie) {

        var year = stats.years[movie.year]
        ,   cert = stats.certifications[movie.certification];

        // Distribution over the years
        if (movie.year && !year) {
          stats.years[movie.year] = {
            movies: 1
          };
        } else if (year) {
          year.movies++;
        }

        // Certifications
        if (movie.certification && !cert) {
          stats.certifications[movie.certification] = {
            movies: 1
          };
        } else if (cert) {
          cert.movies++;
        }

        // Rating distribution
        stats.ratings[movie.rating - 1]++;

        // Actors
        movie.cast.map(function (actor) {
          stats.actors.push(actor);
        });

        // Directors
        movie.director.map(function (director) {
          stats.directors.push(director);
        });

        // Composers
        movie.music.map(function (composer) {
          stats.composers.push(composer);
        });

        movie.genres.map(function (genre) {
          stats.genres.push(genre);
        });

        // Total minutes
        if (movie.runtime) {
          var runtime = parseInt(movie.runtime, 10);
          stats.time.minutes += runtime;
          stats.ratingPlaytime[movie.rating - 1] += runtime;
        }

        // Wilhelm screams
        stats.wilhelms += movie.wilhelm ? 1 : 0;

      });
      
      // Get ten most occuring persons in each category
      // and the total amount of person
      var unsorted = [
        {
          type:'actors',
          array:stats.actors
        },
        {
          type:'directors',
          array:stats.directors
        },
        {
          type:'composers',
          array:stats.composers
        },
        {
          type:'genres',
          array:stats.genres,
          amount: 20
        }
      ];

      unsorted.map(function (obj) {
        var max = obj.amount ? obj.amount : 10;
        var sorted = movee.sortNames(obj.array, max);

        stats[obj.type]         = sorted.array;
        stats.numbers[obj.type] = sorted.total;
      });

      stats.actors.map(function (actor) {
        var actorRating = 0
        ,   zeroRating = 0;

        movee.mongoConnect(function (er, collection) {
          collection.find({ cast: { $regex:actor.name, $options:'i' }}).toArray(function (error, movies) {
            movies.map(function (movie) {
              actorRating += movie.rating ? parseInt(movie.rating, 10) : 0;

              if (!movie.rating) {
                zeroRating++;
              }
            });

            actorRating = (actorRating / (movies.length - zeroRating)).toFixed(2);
          });
        });
      });

      // Calculate some more times from the total minutes
      stats.time.hours = Math.floor(stats.time.minutes / 60);
      stats.time.days  = Math.floor(stats.time.hours / 24);
      stats.time.years = (stats.time.days / 365).toFixed(2);

      res.render('stats', { stats:stats });
      // res.send(stats);
    });
  });
};

exports.np = function(req,res) {

  'use strict';

  var traktKey = 'd406d5272832ce0d4b213dc69ba5aaa4'
  ,   traktUrl = 'http://api.trakt.tv/user/watching.json/{key}/believer';

  request(traktUrl.replace('{key}',traktKey),function (err, response, body) {
    body  = JSON.parse(body);
    var movie = body.movie;

    request('http://localhost:3000/tmdb?imdbid=' + movie.imdb_id, function (err, response, cast) {
      var people = JSON.parse(cast);

      movie.cast = people.cast;
      movie.crew = people.crew;

      request('http://localhost:3000/cover?imdb=' + movie.imdb_id,
        function (err, response, poster) {
          movie.poster = JSON.parse(poster);
          res.render('watching', { movie:movie });
        });
    });

  });
};

exports.tmdb = function(req,res) {

  'use strict';

  var tmdb_url = tmdbBaseUrl + '{query}/casts?api_key={key}'
  ,   query    = req.query
  ,   url      = tmdb_url.replace('{query}', query.imdbid).replace('{key}',tmdbKey);

  request({ uri:url, headers: {'Accept': 'application/json'} },function (err, response, body) {
    res.send(body);
  });
};


exports.trakt = function (req,res) {

  'use strict';

  var traktKey = 'd406d5272832ce0d4b213dc69ba5aaa4'
  ,   traktUrl = 'http://api.trakt.tv/user/watching.json/{key}/believer';

  request(traktUrl.replace('{key}',traktKey),function (err, response, body) {
    body = JSON.parse(body);
    var movie = body.movie;

    request('http://localhost:3000/tmdb?imdbid=' + movie.imdb_id, function (err, response, cast) {
      var people = JSON.parse(cast);
      movie.cast = people.cast;
      movie.crew = people.crew;

      res.send(movie);
    });

  });
};

exports.watching = function(req, res) {

  'use strict';

  request('http://localhost:3000/watching',function (err, response, body) {

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
      img:'',
      runtime:nowWatching.runtime,
      imdbid: nowWatching.imdb_id,
      cast:[],
      music: [],
      writer: [],
      genres: nowWatching.genres,
      certification: nowWatching.certification,
      tagline: nowWatching.tagline,
      wilhelm: wilhelm,
      director: []
    };

    // Add cast
    cast.map(function (actor) {
      myMovie.cast.push(actor.name);
    });

    extraCast
      .split(',')
      .map(function (actor) {
        if (!actor.length) { return; }
        myMovie.cast.push(actor.trim());
      });

    // Add crew
    crew.map(function (person) {
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

function shuffle (array) {

  'use strict';

  var currentIndex = array.length
  ,   temporaryValue
  ,   randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

exports.quiz = function (req,res) {

  'use strict';

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

          alternatives = shuffle(alternatives);

          res.render('quiz', { movie:randomMovie, alternatives:alternatives });
        });
      });
    });
  });
};