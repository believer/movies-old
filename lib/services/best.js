'use strict';

var Q       = require('q');
var request = require('request');

exports.get = function (req) {
  var deferred = Q.defer();

  request('http://api.rickardlaurin.se/best', function (err, res, body) {
    body = JSON.parse(body);
    deferred.resolve(body);
  })

  return deferred.promise;
};