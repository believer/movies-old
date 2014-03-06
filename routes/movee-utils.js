var mongo    = require('mongodb')
,   mongoUri = process.env.MONGO_URL;

/**
 * sortNames
 * Takes an array of names and sorts it into two different arrays
 * one with name and one with the number of movies the person appears in
 * 
 * @param  {array} names A long unsorted list of cast members with duplicates
 * @return {array}       An array with two arrays, [0] Names [1] Number of movies
 */
exports.sortNames = function (names, max) {
  var persons = []
  ,   movies  = []
  ,   prev;

  names.sort();

  names.map(function (name) {
    if (name !== prev) {
      persons.push(name);
      movies.push(1);
    } else {
      movies[movies.length-1]++;
    }

    prev = name;
  });

  return {
    array: exports.getTen([persons, movies], max),
    total: persons.length
  }
};

/**
 * getTen
 * Takes the array from sortNames and make it one array with objects
 * and lastly sorts it with the actor with the most seen movies first
 * 
 * @param  {array} arr Array from sortNames
 * @return {array}     Sorted array of the ten most common persons
 */
exports.getTen = function (arr, max) {
  var sorted = []
  ,   i      = 0;

  for (; i < arr[0].length; i++) {
    var name   = arr[0][i]
    ,   movies = arr[1][i];

    if (name && name !== '-') {
      sorted[i] = {
        name: name,
        movies: movies
      };
    }
  }

  return sorted.sort(function (a,b) {
    return b.movies - a.movies;
  }).slice(0, max);
};

/**
 * mongoConnect
 * Connects to mongo with given db search
 * 
 * @param  {function} connect Function containing mongo search
 */
exports.mongoConnect = function (connect) {
  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection(process.env.MONGODB_DATABASE, connect);
  });
};