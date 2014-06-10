'use strict';

var actor = require('../services/actor');

/**
 * Find an actor by name
 * @param  {obj} req
 * @param  {obj} res
 */
exports.actor = function(req, res, next) {
  var name = req.query.name;

  actor.get(req)
    .then(function (results) {
      res.render('actor', { movies:results, actor:name } );
    })
    .catch(function (error) {
      return next(error);
    });
};