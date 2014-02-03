angular.module('d3game', []).directive('game', function() {

return {
   restrict: "E",
   link: function(scope, element, attrs) {


      var matrix = d3.csv.parseRows(scope.puzzle.puzzle, 
            function(d) { return d.map(function (n) { return +n; }); }
         ); 


      var gamedata =
         [{ id: '1', 
            data: matrix,
            gameSize: 400,
            x: 0,
            y: 0,
            calcScore: POOPSNOOP.calcScoreBiggestSquare
         }];


      var svg = d3.select('#puzzle');

      var game = svg.selectAll('.game')
         .data(gamedata, function(d) { return d.id })
      ;

      game.enter()
         .append('svg:g')
         .attr('class', 'game')
      ;

      game
         .attr('width', function(d) { return d.gameSize; })
         .attr('height', function(d) { return d.gameSize; })
         .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
         })
         .call(POOPSNOOP.newGame)
         .style('opacity', 0)
         .transition()
         .duration(200)
         .style('opacity', 1)
      ;

      game.exit()
         .transition()
         .duration(200)
         .style('opacity', 0)
         .remove()
      ;

   } 
};

});
