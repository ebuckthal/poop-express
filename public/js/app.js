angular.module('poop-app', ['ngRoute', 'ngAnimate', 'controllers', 'directives',  'http-auth-interceptor', 'd3game', 'd3tutorial'])

.config(function ($routeProvider, $locationProvider) {

   $routeProvider.otherwise({ redirectTo: "/start" });

   $routeProvider.when("/puzzles", {
      templateUrl: 'partials/puzzles.html',
      controller: 'PuzzleListCtrl',
      resolve: {

         puzzleList: ['$http', function ($http) {
            return $http.get('/api/puzzle')
               .then(function (data) {
                  return data.data;
               });
         }]
      }
   });

   $routeProvider.when("/start", {
      templateUrl: 'partials/start.html',
      controller: 'StartCtrl'
   });

   $routeProvider.when('/puzzle/:id', {
      templateUrl: 'partials/puzzle.html',
      controller: 'PuzzleCtrl',
      resolve: {

         /*highscore: ['$http', '$route', function($http, $route) {
            return $http.get('/highscore/' + $route.current.params.id)
               .then(function (data) {
                  return data.data;
               });
         }],*/

         puzzle: ['$http', '$route', function($http, $route) {
            return $http.get('/api/puzzle/' + $route.current.params.id)
               .then(function (data) {
                  return data.data;
               });
         }]

      }
   });

})

.run(function ($rootScope, $http) {
   
   $rootScope.user = {};

   /*$http.get('/user')
      .success(function (data) {
         console.log(data);
         $rootScope.user.username = data.username;
      })
      .error(function (data) {
         console.log('not logged in');
      });
   */

});
