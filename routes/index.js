
/*
 * GET home page.
 */

var movee   = require('./movee-utils')
,   request = require('request');

/**
 * Gets all movies from db
 * @param  {obj} req 
 * @param  {obj} res 
 */
exports.index = function(req, res) {

  movee.mongoConnect(function (err, collection) {
    collection.find().sort({date:-1}).limit(100).toArray(function(error, movies) {
      res.render('index', { movies:movies });
    });
  });

};

/**
 * Find an actor by name
 * @param  {obj} req
 * @param  {obj} res
 */
exports.actor = function(req, res) {
  
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
          type:"actors",
          array:stats.actors
        },
        {
          type:"directors",
          array:stats.directors
        },
        {
          type:"composers",
          array:stats.composers
        },
        {
          type:"genres",
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

      stats.actors.map(function (actor, i) {
        var actorRating = 0
        ,   zeroRating = 0;

        movee.mongoConnect(function (er, collection) {
          collection.find({ cast: { $regex:actor.name, $options:'i' }}).toArray(function (error, movies) {
            movies.map(function (movie) {
              actorRating += movie.rating ? parseInt(movie.rating, 10) : 0;

              if (!movie.rating) {
                zeroRating++
              }
            });

            actorRating = (actorRating / (movies.length - zeroRating)).toFixed(2);
            console.log(actorRating);
          });
        });
      });

      // Calculate some more times from the total minutes
      stats.time.hours = ~~(stats.time.minutes / 60);
      stats.time.days  = ~~(stats.time.hours / 24);
      stats.time.years = (stats.time.days / 365).toFixed(2);

      // res.render('stats', { stats:stats });
      res.send(stats);
    });
  });

};

exports.trakt = function(req,res) {
  
  var traktKey = 'd406d5272832ce0d4b213dc69ba5aaa4'
  ,   traktUrl = 'http://api.trakt.tv/user/watching.json/{key}/believer';

  request(traktUrl.replace('{key}',traktKey),function (err, response, body) {
    var body = JSON.parse(body);
    var movie = body.movie;

    request('http://localhost:3000/tmdb?imdbid=' + movie.imdb_id, function (err, response, cast) {
      var people = JSON.parse(cast);
      movie.cast = people.cast;
      movie.crew = people.crew;
      res.send(movie);
    });

  });

};

exports.np = function(req,res) {
  
  var traktKey = 'd406d5272832ce0d4b213dc69ba5aaa4'
  ,   traktUrl = 'http://api.trakt.tv/user/watching.json/{key}/believer';

  request(traktUrl.replace('{key}',traktKey),function (err, response, body) {
    var body = JSON.parse(body);
    var movie = body.movie;

    request('http://localhost:3000/tmdb?imdbid=' + movie.imdb_id, function (err, response, cast) {
      var people = JSON.parse(cast);
      movie.cast = people.cast;
      movie.crew = people.crew;
      res.render('watching', { movie:movie });
    });

  });

};

exports.tmdb = function(req,res) {

  var tmdbBaseUrl = 'http://api.themoviedb.org/3/movie/';
  var tmdbKey     = 'f714b68eea27249e2d7b857433dc2b50';

  var tmdb_url = tmdbBaseUrl + '{query}/casts?api_key={key}'
  ,   query    = req.query
  ,   url      = tmdb_url.replace('{query}', query.imdbid).replace('{key}',tmdbKey);

  console.log(query);

  request({ uri:url, headers: {'Accept': 'application/json'} },function (err, response, body) {
    res.send(body);
  });

};

exports.watching = function(req, res) {

  request('http://localhost:3000/watching',function (err, response, body) {

    var nowWatching = JSON.parse(body)
    ,   cast        = nowWatching.cast
    ,   crew        = nowWatching.crew;


    var myMovie = {
      title: nowWatching.title,
      date: new Date().toISOString(),
      year: nowWatching.year,
      desc: nowWatching.overview,
      imdb: "http://www.imdb.com/" + nowWatching.imdb_id,
      rating: nowWatching.rating ? parseInt(nowWatching.rating, 10) : 0,
      img:null,
      runtime:nowWatching.runtime,
      imdbid: nowWatching.imdb_id,
      cast:[],
      music: [],
      writer: [],
      genres: nowWatching.genres,
      certification: nowWatching.certification,
      tagline: nowWatching.tagline,
      wilhelm: nowWatching.wilhelm ? true : false,
      director: []
    };

    // Add cast
    for(var i = 0; i < cast.length; i++) {
      myMovie.cast[i] = cast[i].name;
    }

    for(i = 0; i < crew.length; i++) {
      if (crew[i].job === "Director") {
        myMovie.director.push(crew[i].name);
      } else if (crew[i].job === "Original Music Composer") {
        myMovie.music.push(crew[i].name);
      }

      if (crew[i].department === "Writing" || crew[i].job === "Screenplay" || crew[i].job === "Writer") {
        myMovie.writer.push(crew[i].name);
      }
    }

    movee.mongoConnect(function (er, collection) {
      collection.find().sort({_id:-1}).limit(1).toArray(function (error, latest) {
        myMovie.id  = parseInt(latest[0].id, 10) + 1;
        myMovie.num = parseInt(latest[0].num, 10) + 1;

        collection.insert(myMovie, function(err, inserted) {
          console.log(error);
          console.log(inserted);
        });

        res.send(myMovie);
      });
    });
  });

};