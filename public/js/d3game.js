angular.module('d3game', []).directive('game', function() {

return {
   restrict: "E",
   link: function(scope, element, attrs) {

      //console.log(scope.puzzle.puzzle);
      //console.log(scope.currentSoln.orient);

      var width = 1000,
          height = 1000;

      var matrix = d3.csv.parseRows(scope.puzzle.puzzle, 
         function(d) { return d.map(function (n) { return +n; }); 
         }
      );

      console.log(matrix);

      var svg = d3.select("game").append("svg")
         .attr("width", width)
         .attr("height", height);

      var row = svg.selectAll(".row")
            .data(matrix)
         .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + 60 * scope.currentSoln.orient[i] + ")"; })
            .each(row);

      var column = svg.selectAll(".column")
            .data(matrix)
         .enter().append("g")
            .attr("class", "column")
            .attr("transform", function(d, i) { return "translate(" + 60 * scope.currentSoln.orient[i] + ")rotate(-90)"; });

      column.append("line")
         .attr("x1", -width);

      function row(row) {

         var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function(d) { return d > 99; }))
         .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d, i, j) { return 60 * scope.currentSoln.orient.indexOf(i); })
            .attr("width", "60px")
            .attr("height", "60px")
            .style("fill", function(d) { return "green";  } )
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

      } 

      function mouseover(p) {
         d3.selectAll(".row").attr("width", function(d, i) { return "70px" });
      }

      function mouseout(p) {
         d3.selectAll(".row").attr("width", "60px");
      }
      



   } 
};

});
