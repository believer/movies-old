
angular.module('App', []);
;(function() {

  'use strict';
  
  angular.module('App').controller('MovieCtrl', function ($scope, $http) {

    $http
      .get('/api/movies')
      .success(function (movies) {
        $scope.movies = movies;
      });    

  });

})();