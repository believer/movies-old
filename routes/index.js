
/*
 * GET home page.
 */

var movee = require('./movee-utils');

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
    genres: [],
    actors: [],
    directors: [],
    composers: [],
    ratings: [0,0,0,0,0,0,0,0,0,0],
    ratingPlaytime: [0,0,0,0,0,0,0,0,0,0],
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

      // Calculate some more times from the total minutes
      stats.time.hours = ~~(stats.time.minutes / 60);
      stats.time.days  = ~~(stats.time.hours / 24);
      stats.time.years = (stats.time.days / 365).toFixed(2);

      res.send(stats);
    });
  });

};