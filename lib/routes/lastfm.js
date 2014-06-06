'use strict';

var lastfm = require('../services/lastfm');

exports.lastfm = function (req, res, next) {
  lastfm.get(req)
    .then(function (result) {
      res.send(result);
    })
    .catch(function (error) {
      return next(error);
    });
};