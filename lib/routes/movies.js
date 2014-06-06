'use strict';

var movies = require('../services/movies');

exports.index = function (req, res, next) {
  req.query.limit = 1;

  movies.get(req)
    .then(function (result) {
      res.render('index', { movie:result.results[0] });
    })
    .catch(function (error) {
      return next(error);
    });
};

exports.numberOfMovies = function (req, res, next) {
  movies.get(req)
    .then(function (result) {
      res.send(result);
    })
    .catch(function (error) {
      return next(error);
    });
};