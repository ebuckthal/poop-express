angular.module('controllers', ['http-auth-interceptor'])

.controller("HeaderCtrl", function ($scope, $http, $rootScope, $modal, authService, $location) {

   $scope.$location = $location;

   $scope.logout = function() {
      $http.get('/user/logout')
         .success(function (data) {
            console.log(data);
            $rootScope.user = {}; 
         })
         .error(function (data) {
            alert('logout fail');
         });
   };

   /*$rootScope.$on('event:auth-loginRequired', function() {
      console.log('login required');
      $scope.login();
   });*/

   $scope.login = function() {
      console.log($scope.creds);

      $http.post('/user/login', $scope.creds)
         .success(function (data) {
            console.log(data);
            console.log('login successful ' + data.email);
            $rootScope.user.email = data.email;

         })
         .error(function (data) {
            console.log(data);
            $rootScope.user = {};
            alert('login fail');
         });

   };

   $scope.register = function() {
      console.log('registering');
      console.log($scope.creds);

      $http.post('/user/register', $scope.creds)
         .success(function (data) {
            $scope.login();
         })
         .error(function (data) {
            alert('registration error');
         });

   };

   /*$scope.login = function() {
      var modalInstance = $modal.open({
         templateUrl: 'partials/login.html',
         controller: 'LoginModalCtrl'
      });


      modalInstance.result.then(function (user) {
         console.log('modal gone');
         $rootScope.user.username = user.username;
         console.log($rootScope.user);
         authService.loginConfirmed();
      }, function() {
         console.log('modal false');
         $rootScope.user = {}; 
         console.log($rootScope.user);
         authService.loginConfirmed();
      });

   };*/

})

.controller("StartCtrl", function($scope) {
})

.controller("LoginModalCtrl", function ($scope, $rootScope, $http, $modalInstance) {

   $scope.creds = {};

   $scope.login = function() {

      $http.post('/user/login', $scope.creds)
         .success(function (data) {
            console.log('login successful');

            $rootScope.user.registered = false;

            $modalInstance.close($scope.creds);
         })
         .error(function (data) {
            alert('login fail');
         });
   };

   $scope.register = function() {
      
      console.log('register');
      console.log($scope.creds);

      $http.post('/user/register', $scope.creds)
         .success(function (data) {
            console.log('registration successful');

            $rootScope.user.registered = true;

            $modalInstance.close($scope.creds);
         })
         .error(function (data) {
            console.log('registration failed');
         });
   };

   $scope.cancel = function () {
      console.log('login cancelled');
      $modalInstance.dismiss('cancel');
   };
   

})

.controller("LeaderboardListCtrl", function ($scope) {
})

.controller("PuzzleListCtrl", function ($scope, $http, puzzleList) {

   //initialize list of visible puzzles
   //console.log(puzzleList);
   $scope.puzzleList = puzzleList;
})

.controller('PuzzleCtrl', function ($scope, $rootScope, $routeParams, $http, puzzle) {

   $scope.debug = false;

   $scope.id = $routeParams.id;
   //console.log(highscore.data);

   $scope.puzzle = puzzle;
   console.log(puzzle);

   $scope.currentSoln = {}; 
   $scope.puzzle.domain = [];
   $scope.currentSoln.orient = [];
   $scope.currentSoln.score = 0;

   for(var i = 0; i < $scope.puzzle.puzzle_size; i++) {
      $scope.currentSoln.orient.push(i);
      $scope.puzzle.domain.push(i);
   }

   console.log($scope.puzzle.domain);

   $scope.bestSoln = {};
   
   $scope.bestSoln.score = $scope.currentSoln.score;
   $scope.bestSoln.orient = $scope.currentSoln.orient.slice();

   $scope.currentSolution = { orient: [], score: 0, index: 0 };
   $scope.bestSolution = { orient: [], score: 0, index: 0 };

   /*$scope.bestSoln = highscore;
   $scope.currentSoln = {};

   if($scope.bestSoln.score && $scope.bestSoln.orient) {

      $scope.currentSoln.score = $scope.bestSoln.score;
      $scope.currentSoln.orient = $scope.bestSoln.orient.slice();

   } else {

      $scope.currentSoln.orient = [];
      $scope.currentSoln.score = 0;

      _.each($scope.puzzle.data, function (p, i) {
         $scope.currentSoln.orient.push(i);
      });
 

      $scope.bestSoln = {};
      
      $scope.bestSoln.score = $scope.currentSoln.score;
      $scope.bestSoln.orient = $scope.currentSoln.orient.slice();

      console.log('should be equal now');
      console.log($scope.bestSoln);
      console.log($scope.currentSoln);

   }

   $scope.$watch('bestSoln.score', function () {
      if($rootScope.user.username) {
         $scope.submit();
      }
   })

   $scope.submit = function () {

      console.log('submitting score');

      $http.post('/highscore/' + $scope.puzzle._id, $scope.currentSoln)
         .success(function (data) {
            console.log(data);
         })
         .error(function (data) {
            alert('score submit fail');
         });
   }*/

})
