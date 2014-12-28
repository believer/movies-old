var request = require('request');
var q = require('q');

var get = function (route) {
  var baseUrl = 'http://api.rickardlaurin.se';
  var deferred = q.defer();

  request(baseUrl + route, function (error, response) {
    response = JSON.parse(response.body);
    deferred.resolve(response);
  });

  return deferred.promise;
};

module.exports = {
  get: get
};