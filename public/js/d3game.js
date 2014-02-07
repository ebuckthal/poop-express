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
            gameSize: 600,
            x: 0,
            y: 0,
            calcScore: POOPSNOOP.calcScoreBiggestSquare,
            onDragEnd: 
               function(cells, orient, domain, cellSize) {
                  d3.select('.game').selectAll('.good')
                     .transition()
                     .duration(100)
                     .style('fill', 'red')
                     .transition()
                     .duration(100)
                     .delay(1000)
                     .style('fill', function(d, i, j) { return POOPSNOOP.getColor(d, false); })
            }
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
