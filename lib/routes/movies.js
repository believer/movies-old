'use strict';

var movies = require('../services/movies');

/**
 * Index route
 * @param  {obj}   req
 * @param  {obj}   res  [description]
 * @param  {Function} next
 */
exports.index = function (req, res, next) {
  movies.get(req)
    .then(function (result) {
      res.render('index', { movies: result.results });
    })
    .catch(function (error) {
      return next(error);
    });
};

/**
 * Index route - but returns raw JSON instead of rendering page
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.numberOfMovies = function (req, res, next) {
  movies.get(req)
    .then(function (result) {
      res.send(result);
    })
    .catch(function (error) {
      return next(error);
    });
};