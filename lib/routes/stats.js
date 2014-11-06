var movee = require('../utils/movee');
var chart = require('canvas-chart');

function connectMongo (cb) {
  movee.mongoConnect(function (err, collection) {
    if (err) { throw err; };
    cb(collection);
  });
}

function getCollection (cb, find, sort) {
  find = find || {};
  sort = sort || { date: -1 };

  connectMongo(function (collection) {
    collection.find(find).sort(sort).toArray(function (error, movies) {
      cb(movies);
    });
  });
}

function getYears (cb) {
  var years = {};
  var yearsArray;

  getCollection(function (movies) {
    movies.forEach(function (movie) {
      var year = years[movie.year];

      // Distribution over the years
      if (movie.year && !year) {
        years[movie.year] = {
          movies: 1
        };
      } else if (year) {
        year.movies++;
      }

      yearsArray = Object.keys(years).map(function (year) {
        return years[year].movies;
      }, []);
    });

    cb(years, yearsArray);
  });
}

function getActors (cb, actors) {
  actors.forEach(function (actor, i) {
    var actorRating = 0;
    var zeroRating = 0;

    getCollection(function (movies) {
      movies.forEach(function (movie) {
        actorRating += movie.rating ? parseInt(movie.rating, 10) : 0;

        if (!movie.rating) {
          zeroRating++;
        }
      });

      actor.rating = (actorRating / (movies.length - zeroRating)).toFixed(2);

      cb(actors);
    }, { cast: { $regex:actor.name, $options:'i' }});
  });
}

// Create a year graph
getYears(function (years, yearsArray) {
  chart.graph([10,20,30,60], {
    filename: 'movies',
    fillColor: 'rgba(12, 165, 176, 1)'
  });
});

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

  // Movies per year
  getYears(function (years) {
    stats.years = years;
  });

  getCollection(function (movies) {
    stats.total = movies.length;

    movies.forEach(function (movie) {
      var cert = stats.certifications[movie.certification];

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
        array: stats.actors
      },
      {
        type:'directors',
        array: stats.directors
      },
      {
        type:'composers',
        array: stats.composers
      },
      {
        type:'genres',
        array:stats.genres,
        amount: 20
      }
    ];

    unsorted.forEach(function (obj) {
      var max = obj.amount ? obj.amount : 10;
      var sorted = movee.sortNames(obj.array, max);

      stats[obj.type]         = sorted.array;
      stats.numbers[obj.type] = sorted.total;
    });

    // getActors(function (actors) {
    //   stats.actors = actors;
    // }, stats.actors);

    // Calculate some more times from the total minutes
    stats.time.hours = Math.floor(stats.time.minutes / 60);
    stats.time.days  = Math.floor(stats.time.hours / 24);
    stats.time.years = (stats.time.days / 365).toFixed(2);

    res.render('stats', { stats:stats });
    // res.send(stats);
  }, null, { date: -1 });
};