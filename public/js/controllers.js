angular.module('controllers', [])

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

.controller("StartCtrl", function($scope, $window) {

   $scope.window = $window;

   $scope.scrollToNext = function(index) {

      console.log("scroll to " + index * $window.innerHeight);
      TweenLite.to(window, 0.5, { 
         scrollTo: {
            y: (index + 1) * $window.innerHeight
         }, 
         ease:Power1.easeInOut
      });
   }

   $scope.slides = [
      {
         text: "Certain strains of E. coli are a major cause of foodborne bacterial diseases."
      },
      {
         text: "In order to monitor populations of E. coli more closely, Cal Poly has created a database of E. coli samples. The database contains important information about the strain including the species of origin, date, and region."

      },
      {
         text: "The purpose of Poop Snoop is to group the samples of E. coli into strains. Researchers like to know when dangerous strains might be infecting bodies of water or crops."

      },
      {
         text: "Every E. coli sample has two important pieces of DNA. We can compare E. coli samples by comparing these two pieces of DNA."

      },
      {
         text: "Each piece of DNA is either certain to match, certain to not match, or it is a potential match."

      },
      {
         text: "Each E. coli sample then compares both of its DNA pieces to both the DNA pieces of every other E. coli sample."

      },
      {
         text: "If both of a samples DNA match both of another samples, it's likely that those samples are part of the same strain."

      },
      {
         text: "Poop Snoop is a grid visualizing the pieces of DNA that match within one E. coli sample."

      },
      {
         text: "The top quadrant is the matches of one DNA piece. The bottom quandrant is the matches in the second DNA piece."
      },
      {
         text: "The goal is to create the largest square of matching DNA fingerprints. The square must begin at the highlighted diagonal."
      },
      {
         text: "The score corresponds to how large the square is."
      },
      {
         text: "To make a bigger square, you can drag and reorganize the rows and columns, but there is one rule. The rows and columns must be kept in the same order. This means all reordering will be done along the diagonal."
      }
   ]
   
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
