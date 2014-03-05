/**
 * sortNames
 * Takes an array of names and sorts it into two different arrays
 * one with name and one with the number of movies the person appears in
 * 
 * @param  {array} names A long unsorted list of cast members with duplicates
 * @return {array}       An array with two arrays, [0] Names [1] Number of movies
 */
exports.sortNames = function (names) {
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
    array: exports.getTen([persons, movies]),
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
exports.getTen = function (arr) {
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
  }).slice(0,10);
};
