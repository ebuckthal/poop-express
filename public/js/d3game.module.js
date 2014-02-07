var POOPSNOOP = (function() {

   d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
         this.parentNode.appendChild(this);
      });
   };

   function endall(transition, callback) { 
      var n = 0; 
      transition 
         .each(function() { ++n; }) 
         .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
   } 

   function shuffle(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
   };

   function calcScoreBiggestSquare(selection, orient) {

      /*
      var big = 0;

      for(var index = 0; index < orient.length; index++) {
         var size;
         for(size = 0; size < orient.length + 1 - index; size++) {

            var success = true;

            selection
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


         big = Math.max(size-1, big);

         if(size-1 > scope.currentSolution.score) {

            scope.currentSolution.score = size-1;
            scope.currentSolution.orient = orient.slice(0);
            scope.currentSolution.index = index;

         }*/



      console.log('CALCSCORE BIGGEST SQUARE: ' + big);
   };


   function calcClusterAverage(selection, orient, size, found) {

      this
      .style('fill', function(d, i, j) { return getColor(d, false); })
      .transition()
      .duration(100)
      .delay(100 * size)
      .style('fill', 'red')
   };

   function getColor(d, highlight) {
      if(highlight) {
         return d > 99.5 ? "#33C5FF" : (d > 99 ? "#E0E089" : "#DDDDDD");
      } else {
         return d > 99.5 ? "#2DAEE1" : (d > 99 ? "#E0E089" : "#CCC");
      }
   }

   function calcScoreAveragePearson(selection, orient) {

      this.classed('good', false)
      //for each cell in diagonal
      for(var index = 0; index < orient.length; index++) {

         //for each increasing size of cluster
         //var index = 3;
            var avg = 100;
            var found = false;

         for(var size = 1; size < orient.length-index+1; size++) {

            var total = 0;

            console.log("size: " + size + ' at ' + index);

            var sol = this.select(function(d, i, j) { 

               return (( orient.indexOf(i) >= index && orient.indexOf(i) < index + size ) &&
                      ( orient.indexOf(j) >= index && orient.indexOf(j) < index + size)) ? this : null;

            }).each(function(d, i, j) {
               total += d;
            });

            var avg = total / (size * size);
            //console.log('avg ' + avg);

            if(avg > 99.7) {
               sol.classed('good', true)
            }

         }


      }

   };

   function newGame(selection) {

      if(selection.data()[0] === undefined) {
         return;
      }
      
      var matrix = selection.data()[0].data;
      var gameSize = selection.data()[0].gameSize;

      var cells;
      var rows;

      //drag stuff
      var selectedRow = null;
      var selectedIndex = null;
      var mouseSwapLeft = null;
      var mouseSwapRight = null;
      var mouseDrawRectOffset = null;

      //placeholders
      var calcScore = selection.data()[0].calcScore || function(sel, orient) {};
      var onDragEnd = selection.data()[0].onDragEnd || function() {};

      //if no orient, make the default orient
      var orient = selection.data()[0].orient;

      if(orient === undefined) {
         orient = [];

         for(var i = 0; i < matrix.length; i++) {
            orient.push(i);
         }
      } 

      //create domain, we need a domain to start with of orient length
      var d = [];
      for(var i = 0; i < orient.length; i++) {
         d.push(i);
      }
      var domain = d3.scale.ordinal().rangeBands([0, gameSize], 0.1).domain(d);
      var cellSize = gameSize / orient.length - (0.2 * gameSize / orient.length);


      var drag = d3.behavior.drag()
         .on("dragstart", dragStart)
         .on("drag", dragDo)
         .on("dragend", dragEnd)
      ;

      rows = this.selectAll(".row")
         .data(matrix)
         .enter()
         .append("svg:g")
         .attr('class', 'row')
      ;


      cells = rows.selectAll(".cell")
         .data(function(d, i) { return d; })
         .enter()
         .append("rect")
         .attr('class', function(d, i, j){ return "cell r" + j + " c" + i; }) 
         .attr('width', cellSize)
         .attr('height', cellSize)
         .attr('rx', 2)
         .attr('ry', 2)
      ;

      cells
         .style('fill', function(d, i, j) { return getColor(d,i,j, false); })
         .attr("transform", function(d, i, j) {
            return "translate(" + domain(i) + "," + domain(j) + ")";
         })
         .on("mouseenter", highlightCells) 
         .on("mouseleave", unhighlightCells) 
         .call(drag)
      ;

      
      function dragStart(d, i, j) {
         selectedRow = j;
         selectedIndex = orient.indexOf(selectedRow);

         mouseSwapLeft = domain(selectedIndex);
         mouseSwapRight = domain(Math.min(orient.length-1,selectedIndex+1));

         mouseDrawRectOffset = (cellSize) / 2;

         rows.select(function(d, i) { return selectedRow == i ? this : null; })
            .moveToFront();

         //turn off event listeners and highlight the dragging row
         cells
            .on("mouseenter", null)
            .on("mouseleave", null)
            .call(highlightCells)
         ;
      }

      function dragDo(d, i, j) {

         var mousePosition = d3.mouse(this.parentNode)[1];
         var mouseDrawRect = Math.min(Math.max(domain(0), mousePosition - mouseDrawRectOffset), 
            domain(orient.length-1));


         if(((mousePosition < mouseSwapLeft && selectedIndex > 0) || 
            (mousePosition > mouseSwapRight && selectedIndex < orient.length-1))) {

            var swapIndex = mousePosition < mouseSwapLeft ? selectedIndex - 1 : selectedIndex + 1;
            var redrawRow = orient[swapIndex];

            //do da swap
            orient[swapIndex] = orient[selectedIndex];
            orient[selectedIndex] = redrawRow;

            cells
               .select(function(d, ix, jx) {
                  return (
                     (
                        (ix != selectedRow && jx != selectedRow ) && 
                        (redrawRow == ix || redrawRow == jx)
                     ) ? this : null
                  ); 
               })
               .transition()
               .duration(150)
               .delay(function(d, i, j) {
                  return 3 * distanceFromDiagonal(i,j);
               })
               .attr("transform", function(d, i, j) { 
                  return "translate(" + domain(orient.indexOf(i)) + "," + domain(orient.indexOf(j)) + ")"; 
               })
            ;

            selectedIndex = orient.indexOf(selectedRow);
            mouseSwapLeft = domain(selectedIndex);
            mouseSwapRight = domain(selectedIndex + 1);
         }
         //UPDATE DRAGGING ROWS AND COLUMNS

         cells
            .select(function(d, ix, jx) {
               return (selectedRow == ix && selectedRow != jx ? this : null); 
            })
            .attr("transform", function(d, i, j) {
               return "translate(" + mouseDrawRect + "," + domain(orient.indexOf(j)) + ")";
            });

         cells
            .select(function(d, ix, jx) {
               return (selectedRow == jx && selectedRow != ix ? this : null); 
            })
            .attr("transform", function(d, i, j) {
               return "translate(" + domain(orient.indexOf(i)) + "," + mouseDrawRect + ")";
            });

         cells
            .select(function(d, ix, jx) {
               return (selectedRow == jx && selectedRow == ix ? this : null); 
            })
            .attr("transform", function(d, i, j) {
               return "translate(" + mouseDrawRect + "," + mouseDrawRect + ")";
            });
      }


      function dragEnd(d, i, j) {
         cells
            .select(function(d, i, j) { return i == selectedRow || j == selectedRow ? this: null; })
            .transition()
            .duration(150)
            .attr("transform", function(d, i, j) { 
               return "translate(" + domain(orient.indexOf(i)) + "," + domain(orient.indexOf(j)) + ")"; 
            })
            .call(endall, function() { onDragEnd(cells, orient, domain, cellSize) })
         ;

         cells
            .on("mouseenter", highlightCells)
            .on("mouseleave", unhighlightCells)
         ;

         cells
            .call(calcScoreAveragePearson, orient);
      };


      function updateToOrient(orientIn) {

         if(orient.length != orientIn.length) 
            return null;

         orient = orientIn;

         cells.transition()
            .duration(200)
            .attr("transform", function(d, i, j) {
               return "translate(" + domain(orient.indexOf(i)) + "," + domain(orient.indexOf(j)) + ")";
            })
         ;

      };

      function distanceFromDiagonal(i, j) {
         return Math.abs(Math.min(orient.indexOf(i) - orient.indexOf(j)));
      }

      function getColor(d, i, j, highlight) {
         if(highlight) {
            return d > 99.5 ? "#33C5FF" : (d > 99 ? "#E0E089" : "#DDDDDD");
         } else {
            if(i > j) {
               return d > 99.5 ? "#2DAEE1" : (d > 99 ? "#E0E089" : "#CCC");
            } else {
               return d > 99.5 ? "#0376E1" : (d > 99 ? "#E0CF3A" : "#BBB");
            }
         }
      }

      function highlightCells(d, i, j) {

         var index = j;

         cells
            .select(function(d, ix, jx) {
               return (index == ix || index == jx ? this : null);
            })
            .style('fill', function(d, i, j) { return getColor(d,i,j, true); }) 
            .style('cursor', 'nwse-resize');
      }  

      function unhighlightCells(d, i, j) {

         var index = j;

         cells
            .select(function(d, ix, jx) {
               return (index == ix || index == jx ? this : null);
            })
            .style("fill", function(d, i, j) { return getColor(d,i,j, false); }); 
      };


   };

   function highlightRowsCols() {


      var rc = d3.select('.game').selectAll('.row').selectAll('.cell')
         .select(function(d, i, j) { return (i == j ? this : null); })
      ;

      rc.append('rect')
         .attr('height', 400)
         .attr('width', 2)
         .style('fill', 'red')
         .attr("transform", function(d, i, j) {
            return "translate(" + (i*4) + ",0)"; 
         })
      ;

   };

   function setOnDragEnd(sel, func) {

      return this;

   }


   return {
      newGame: newGame,
      calcScoreBiggestSquare: calcScoreBiggestSquare,
      getColor: getColor
   };

})();
