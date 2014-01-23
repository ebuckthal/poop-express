angular.module('d3game', []).directive('game', function() {

return {
   restrict: "E",
   link: function(scope, element, attrs) {

      var matrix = d3.csv.parseRows(scope.puzzle.puzzle, 
         function(d) { return d.map(function (n) { return +n; }); 
         }
      );


      //var orient = [0,1,2,3,4,5,6,7,8,9];
      var orient = scope.currentSoln.orient;
      var r_sel = null;
      var i_sel = null;
      var d_left = null;
      var d_right = null;
      var svg_top_offset = null;
      var d_mouse_init_x = null;
      var d_mouse_init_y = null;
      var big_square = null;

      var width = 600,
          height = 600;

      var game_width = 600;
      //console.log(scope.puzzle.domain);

      var x = d3.scale.ordinal().rangeBands([0, game_width], 0.1).domain(scope.puzzle.domain);

      //console.log(matrix);

      var solutions = [scope.currentSolution, scope.bestSolution];

      //console.log(scope.puzzle.puzzle);
      //console.log(scope.currentSoln.orient);
      d3.selection.prototype.moveToFront = function() {
         return this.each(function(){
            this.parentNode.appendChild(this);
         });
      };

      function updateScore() {

         //var scores = score_g.selectAll('rect')
         //   .data(solutions);

         var scores = d3.selectAll('div.score')
            .data(solutions)
            .transition()
            .duration(200)
            .style('width', function(d) { return (50*d.score) + "px"; })
         ;

         cells
            .select(function(d, i, j) {
               return (orient.indexOf(i) >= scope.currentSolution.index && 
                  orient.indexOf(i) < scope.currentSolution.index+scope.currentSolution.score && 
                  orient.indexOf(j) >= scope.currentSolution.index && 
                  orient.indexOf(j) < scope.currentSolution.index+scope.currentSolution.score) ? this : null;
            })
            .select('rect')
            .transition()
            .duration(200)
            .style('fill', '#D55332')
            //.delay(function(d, i, j) { return 5*orient.indexOf(i) + 5*orient.indexOf(j); })
            .transition()
            .style("fill", function(d) { return d > 99 ? "#2daee1" : "#ccc"; }) 
         ;

      }

      function calcScore() {

         var big = 0;

         scope.currentSolution.score = 0;

         for(var index = 0; index < orient.length; index++) {

            var size;

            for(size = 0; size < orient.length + 1 - index; size++) {

               var success = true;

               cells
                  .select(function(d, i, j) {
                     return (orient.indexOf(i) >= index && 
                        orient.indexOf(i) < index+size && 
                        orient.indexOf(j) >= index && 
                        orient.indexOf(j) < index+size) ? this : null;
                  })
                  .each(function(d, i, j) {
                     success = (d > 99 ? success : false);
                  });

               if(!success) {
                  break;
               }
            }

            if(size-1 > scope.currentSolution.score) {

               scope.currentSolution.score = size-1;
               scope.currentSolution.orient = orient.slice(0);
               scope.currentSolution.index = index;

            }

         }

         scope.currentSolution.orient = orient.slice(0);
         
         if(scope.currentSolution.score > scope.bestSolution.score) {
            scope.bestSolution.score = scope.currentSolution.score;
            scope.bestSolution.index = scope.currentSolution.index;
            scope.bestSolution.orient = scope.currentSolution.orient.slice(0);
         }

      }

      function highlight(d, i, j) {

         var index = j; 

         return cells.select("rect")
            .select(function(d, ix, jx) {
                  return (index == ix || index == jx ? this : null); 
               })
            .transition()
            .duration(0)
            .style("fill", function(d) { return d > 99 ? "#33C5FF" : "#ddd"; }) 
            .style("cursor", 'nwse-resize');

      }

      function unhighlight(d, i , j) {

         return cells.select("rect")
            .transition()
            .duration(0)
            .style("fill", function(d) { return d > 99 ? "#2daee1" : "#ccc"; }) 

      }

      
      function shuffle(o){ //v1.0
         for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
         return o;
      };

      function dist_from_diag(i,j) {
         return Math.abs(Math.min(orient.indexOf(i) - orient.indexOf(j)));
      }

      var drag = d3.behavior.drag()
         .on("dragstart", function(d, i, j) {
            r_sel = j;
            i_sel = orient.indexOf(r_sel);
            d_left = x(i_sel);
            d_right = x(Math.min(orient.length-1,i_sel+1));

            d_mouse_cor = (d_right - d_left) / 2;
            svg_top_offset = document.querySelector('svg').getBoundingClientRect().top;

            rows.select(function(d, i) { return r_sel == i ? this : null; })
               .moveToFront();

            cells
               .call(function(d, i, j) { highlight(d, i, j) });

            cells
               .on("mouseenter", null)
               .on("mouseleave", null)
            ;

            console.log(i_sel + ' ' + d_left + ' ' + d_right);
         })
         .on("drag", function(d, i, j) {

            //console.log(d3.event);

            var d_mouse = d3.event.sourceEvent.pageY - svg_top_offset;

            var draw_x = Math.min(Math.max(x(0), d_mouse - d_mouse_cor), x(orient.length-1));
            var draw_y = Math.min(Math.max(x(0), d_mouse - d_mouse_cor), x(orient.length-1));

            //console.log(draw_x + ' ' + draw_y + ' ' + x(orient.length-1) + ' ' + (d_mouse-d_mouse_cor));

            if(((d_mouse < d_left && i_sel > 0) || (d_mouse > d_right && i_sel < orient.length-1))) {

               var i_swap = d_mouse < d_left ? i_sel - 1 : i_sel + 1;

               //console.log('swapping indeces! ' + i_sel + ' ' + i_swap);

               var r_redraw = orient[i_swap];
               orient[i_swap] = orient[i_sel];
               orient[i_sel] = r_redraw;

               cells
                  .select(function(d, ix, jx) {
                     return (((ix != r_sel && jx != r_sel) && (r_redraw == ix || r_redraw == jx)) ? this : null); 
                  })
                  .transition()
                  .duration(150)
                  .delay(function(d, i, j) {
                     return 3 * dist_from_diag(i,j);
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
                  return "translate(" + draw_x + "," + x(orient.indexOf(j)) + ")";
               });

            cells
               .select(function(d, ix, jx) {
                  return (r_sel == jx && r_sel != ix ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + x(orient.indexOf(i)) + "," + draw_y + ")";
               });

            cells
               .select(function(d, ix, jx) {
                  return (r_sel == jx && r_sel == ix ? this : null); 
               })
               .attr("transform", function(d, i, j) {
                  return "translate(" + draw_x + "," + draw_y + ")";
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

            cells
               .on("mouseenter", function(d, i, j) { highlight(d, i, j); })
               .on("mouseleave", function(d, i, j) { unhighlight(d, i, j); })
            ;

            calcScore();
            updateScore();
         })
      ;

      var svg = d3.select("game").append("svg")
         .attr("width", width)
         .attr("height", height)
      ;

      var score_g = svg.append("svg:g")
         .attr('transform', 'translate(600,0)');

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

               highlight(d, i, j);
            })
            .on("mouseleave", function(d, i, j) {

               unhighlight(d, i, j);

            })
            .on("dblclick", function(d, i, j) {

               //console.log(cells);

               orient = shuffle(orient);

               cells.transition()
                  .duration(function(d, i, j) {
                     return 200 + (30 * orient.indexOf(i)) + (30 * orient.indexOf(j));
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
            .attr("width", game_width/orient.length - 5)
            .attr("height", game_width/orient.length - 5)
            .style("fill", function(d) { return d > 99 ? "#2daee1" : "#ccc"; }) 
      ;

      updateScore();

      if(scope.debug) {

         cells.append("text")
               .attr("transform", "translate(15, 16)")
               .attr("dy", "0.3em")
               .style("text-anchor", "middle")
               .style("fill", "black")
               .text(function(d, i, j) { return i + " | " + j; })
         ;
      }
   } 
};

});
