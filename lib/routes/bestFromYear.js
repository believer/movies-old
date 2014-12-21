'use strict';

var bestFromYearService = require('../services/best');

function sortData (data) {
  var sorted = [];
  Object.keys(data).sort(function (a,b) {
    return parseInt(a,10) > parseInt(b,10) ? -1 : 1
  }).forEach(function (key) {
    sorted.push({
      movies: data[key],
      year: key
    });
  });
  return sorted;
}

exports.bestFromYear = function (req, res, next) {
  bestFromYearService.get(req)
    .then(function (result) {
      result = sortData(result);
      res.render('best', {years: result});
    })
    .catch(function (error) {
      return next(error);
    });
};