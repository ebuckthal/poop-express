angular.module('d3game', []).directive('game', function() {

return {
   restrict: "E",
   link: function(scope, element, attrs) {

      //console.log(scope.puzzle.puzzle);
      //console.log(scope.currentSoln.orient);
      function shuffle(o){ //v1.0
         for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
         return o;
      };

      function dist_from_diag(i,j) {
         return Math.abs(Math.min(orient.indexOf(i) - orient.indexOf(j)));
      }

      var width = 500,
          height = 500;

      var matrix = d3.csv.parseRows(scope.puzzle.puzzle, 
         function(d) { return d.map(function (n) { return +n; }); 
         }
      );

      var orient = [0,1,2,3,4,5,6,7,8,9];
      var r_sel = null;
      var i_sel = null;
      var d_left = null;
      var d_right = null;

      var x = d3.scale.ordinal().rangeBands([0, width], 0.1).domain([0,1,2,3,4,5,6,7,8,9]);

      console.log(matrix);


      var drag = d3.behavior.drag()
         .on("dragstart", function(d, i, j) {
            r_sel = Math.max(i,j);
            i_sel = orient.indexOf(r_sel);
            d_left = x(i_sel);
            d_right = x(i_sel + 1);

            //console.log(i_sel + ' ' + d_left + ' ' + d_right);
         })
         .on("drag", function(d, i, j) {

            var d_mouse = Math.max(d3.event.x, d3.event.y);

            if(((d_mouse < d_left && i_sel > 0) || (d_mouse > d_right && i_sel < orient.length))) {

               var i_swap = d_mouse < d_left ? i_sel - 1 : i_sel + 1;

               //console.log('swapping indeces! ' + i_sel + ' ' + i_swap);

               var r_redraw = orient[i_swap];
               orient[i_swap] = orient[i_sel];
               orient[i_sel] = r_redraw;

               cells
                  .select(function(d, ix, jx) {
                     return (r_redraw == ix || r_redraw == jx ? this : null); 
                  })
                  .transition()
                  .duration(150)
                  .delay(function(d, i, j) {
                     return 15 * dist_from_diag(i,j);
                  })
                  .attr("transform", function(d, i, j) { 

                     return "translate(" + x(orient.indexOf(i)) + "," + x(orient.indexOf(j)) + ")"; 

                  })
               ;

               i_sel = orient.indexOf(r_sel);
               d_left = x(i_sel);
               d_right = x(i_sel + 1);

            }

            //UPDATE DRAGGING ROWS AND COLUMNS

            cells
               .select(function(d, ix, jx) {
                  return (r_sel == ix && r_sel != jx ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + d_mouse + "," + x(orient.indexOf(j)) + ")";
               });

            cells
               .select(function(d, ix, jx) {
                  return (r_sel == jx && r_sel != ix ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + x(orient.indexOf(i)) + "," + d_mouse + ")";
               });

            cells
               .select(function(d, ix, jx) {
                  return (r_sel == jx && r_sel == ix ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + d_mouse + "," + d_mouse + ")";
               });

         })
         .on("dragend", function(d, i, j) {

            cells
               .select(function(d, i, j) { return i == r_sel || j == r_sel ? this: null; })
               .transition()
               .duration(150)
               .attr("transform", function(d, i, j) { 

                  return "translate(" + x(orient.indexOf(i)) + "," + x(orient.indexOf(j)) + ")"; 

               })
            ;
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

               var index = Math.max(i,j); 

               cells.select("rect")
                  .select(function(d, ix, jx) {
                     return (index == ix || index == jx ? this : null); 
                  })
                  .transition()
                  .style("fill", function(d) { return d > 99 ? "#23c897" : "#ddd"; }) 
                  .duration(50)
                  .delay(function(d, i, j) { 
                     return 30 * dist_from_diag(i,j); 
                  })
            })
            .on("mouseleave", function(d, i, j) {

               cells.select("rect")
                  .transition()
                  .style("fill", function(d) { return d > 99 ? "#2daee1" : "#ccc"; }) 
                  .duration(150);

            })
            .on("click", function(d, i, j) {

               //console.log(cells);

               orient = shuffle(orient);

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

               //console.log(i + " " + j);


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
