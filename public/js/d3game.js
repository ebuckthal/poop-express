angular.module('d3game', []).directive('game', function() {

return {
   restrict: "E",
   link: function(scope, element, attrs) {

      //console.log(scope.puzzle.puzzle);
      //console.log(scope.currentSoln.orient);

      var width = 500,
          height = 500;

      var matrix = d3.csv.parseRows(scope.puzzle.puzzle, 
         function(d) { return d.map(function (n) { return +n; }); 
         }
      );

      var orient = [0,1,2,3,4,5,6,7,8,9];

      var x = d3.scale.ordinal().rangeBands([0, width], 0.1).domain([0,1,2,3,4,5,6,7,8,9]);

      console.log(matrix);


      var drag = d3.behavior.drag()
         .on("dragstart", function(d, i, j) {
            console.log('dragstart ' + i + ' ' + j);

         })
         .on("drag", function(d, i, j) {

            var index_max = Math.max(i,j);
            var d_max = Math.max(d3.event.x, d3.event.y);

            cells
               .select(function(d, ix, jx) {
                  return (index_max == ix && index_max != jx ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + d_max + "," + x(j) + ")";
               });

            cells
               .select(function(d, ix, jx) {
                  return (index_max == jx && index_max != ix ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + x(i) + "," + d_max + ")";
               });
         })
         .on("dragend", function(d, i, j) {

         })
      ;

      var svg = d3.select("game").append("svg")
         .attr("width", width)
         .attr("height", height);

      svg.append("rect")
         .attr("width", width)
         .attr("height", height)
         .style("fill", "#f1f1f1");

      var rows = svg.selectAll(".rows")
            .data(matrix)
            .enter()
            .append("svg:g")
      ; 

      var cells = rows.selectAll(".cell")
            .data(function(d, i) { return d; })
            .enter()
            .append("svg:g")
            .attr("transform", function(d, i, j) { 

               return "translate(" + x(i) + "," + x(j) + ")"; 

            })
            .on("mouseenter", function(d, i, j) { 

               var index = i > j ? i : j;

               cells.select("rect")
                  .filter(function(d, ix, jx) { return index == ix || index == jx; })
                  .transition()
                  .style("fill", function(d) { return d > 99 ? "#eee" : "#eee"; }) 
                  .duration(50)
                  .delay(function(d, i, j) { 
                     var dist = Math.abs(index - (j == index ? i : j));
                     return 15 * dist; 
                  })
            })
            .on("mouseleave", function(d, i, j) {

               cells.select("rect")
                  .transition()
                  .style("fill", function(d) { return d > 99 ? "#2daee1" : "#ccc"; }) 
                  .duration(150);

            })
            .on("click", function(d, i, j) {

               console.log(cells);

               var orient = [1,0,2,3,4,5,6,7,8,9];

               cells.transition()
                  .duration(150)
                  .delay(function(d, i, j) {
                     return 30 + (30 * i) + (30 * j);
                  })
                  .attr("transform", function(d, i, j) { 

                     //console.log(i + " " + x(orient.indexOf(i)) + " " + j + " " + x(orient.indexOf(j)));
                     //console.log(d);

                     return "translate(" + x(orient.indexOf(i)) + "," + x(orient.indexOf(j)) + ")"; 

                  })
               ;

               console.log(i + " " + j);


            })
            .call(drag)
      ;

      cells.append("rect")
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("width", 45)
            .attr("height", 45)
            .style("fill", function(d) { return d > 99 ? "#2daee1" : "#ccc"; }) 
      ;

      cells.append("text")
            .attr("transform", "translate(15, 16)")
            .attr("dy", "0.3em")
            .style("text-anchor", "middle")
            .style("fill", "black")
            .text(function(d, i, j) { return i + " | " + j; })
      ;


/*
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
      


      */

   } 
};

});
