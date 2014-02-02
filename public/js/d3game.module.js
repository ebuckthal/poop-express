var POOPSNOOP = (function() {

   function newGame(options) {

      var matrix = options.data;
      var gameSize = options.gameSize || 600;
      var gameTop = options.gameTop || 0;
      var gameLeft = options.gameLeft || 0;

      var svg = null; 
      var cells = null;
      var rows = null;

      var cellSize = null;

      var orient = null;
      var domain = null;


      //drag stuff
      var selectedRow = null;
      var selectedIndex = null;
      var svgOffset = null;
      var mouseInitX = null;
      var mouseInitY = null;
      var mouseSwapLeft = null;
      var mouseSwapRight = null;
      var mouseDrawRectOffset = null;

      //placeholder
      var onDragEnd = options.onDragEnd || function() {

      }
      
      var drag = d3.behavior.drag()
         .on("dragstart", function(d, i, j) {
            selectedRow = j;
            selectedIndex = orient.indexOf(selectedRow);

            mouseSwapLeft = domain(selectedIndex);
            mouseSwapRight = domain(Math.min(orient.length-1,selectedIndex+1));

            mouseDrawRectOffset = (cellSize) / 2;
            svgOffset = 0; //document.querySelector(idSVG).getBoundingClientRect().top;

            rows.select(function(d, i) { return selectedRow == i ? this : null; })
               .moveToFront();

            //turn off event listeners and highlight the dragging row
            cells
               .on("mouseenter", null)
               .on("mouseleave", null)
               .call(function(d, i, j) { highlightCells(d, i, j) })
            ;

         })
         .on("drag", function(d, i, j) {

            //get mousey stuff
            var mousePosition = d3.event.sourceEvent.pageY - svgOffset;
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

         })
         .on("dragend", function(d, i, j) {

            function endall(transition, callback) { 
               var n = 0; 
               transition 
                  .each(function() { ++n; }) 
                  .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
            } 

            cells
               .select(function(d, i, j) { return i == selectedRow || j == selectedRow ? this: null; })
               .transition()
               .duration(150)
               .attr("transform", function(d, i, j) { 

                  return "translate(" + domain(orient.indexOf(i)) + "," + domain(orient.indexOf(j)) + ")"; 

               })
               .call(endall, function() { onDragEnd(cells, orient, domain, cellSize) });
            ;

            cells
               .on("mouseenter", function(d, i, j) { highlightCells(d, i, j); })
               .on("mouseleave", function(d, i, j) { unhighlightCells(d, i, j); })
            ;

            //calcScore();
            //updateScore();
         })
      ;



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

      if(options.orientPrevious !== undefined) {
         if(matrix.length != options.orientPrevious.length) {
            console.log('initial orient and matrix do not match');
            return null;
         }

         for(var i = 0; i < matrix.length; i++) {
            if(matrix[i].length != options.orientPrevious.length) {
               console.log('initial orient and matrix do not match');
               return null;
            }

         }

         orient = options.orientPrevious;
      } else {

         orient = [];

         for(var i = 0; i < matrix.length; i++) {
            orient.push(i);
         }

      }

      var d = [];
      for(var i = 0; i < orient.length; i++) {
         d.push(i);
      }

      cellSize = gameSize / orient.length - 10;
      domain = d3.scale.ordinal().rangeBands([0, gameSize], 0.1).domain(d);

      svg = d3.select(options.idSVG).append("svg:g")
         .attr('transform', function() {
            return "translate(" + gameLeft + "," + gameTop +")";
         });
      //attr('top', gameTop).attr('left', gameLeft);

      rows = svg.selectAll(".row")
         .data(matrix)
         .enter()
         .append("svg:g")
      ;


      cells = rows.selectAll(".cell")
         .data(function(d, i) { return d; })
         .enter()
         .append("svg:g")
         .attr("transform", function(d, i, j) {

            return "translate(" + domain(i) + "," + domain(j) + ")";
         })
         .on("mouseenter", function(d, i, j) {
            highlightCells(d, i, j);
         })
         .on("mouseleave", function(d, i, j) {
            unhighlightCells(d,i,j);
         })
         .call(drag)
      ;

      cells
         .append("rect")
         .attr("width", cellSize)
         .attr("height", cellSize)
         .attr("rx", 2)
         .attr("ry", 2)
         .style('fill', function(d) { return getColor(d, false); })
      ;

      d3.selection.prototype.moveToFront = function() {
         return this.each(function(){
            this.parentNode.appendChild(this);
         });
      };



      function shuffle(o) {
         for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
         return o;
      };

      function distanceFromDiagonal(i, j) {
         return Math.abs(Math.min(orient.indexOf(i) - orient.indexOf(j)));
      }

      function getColor(d, highlight) {
         if(highlight) 
            return d > 99.5 ? "#33C5FF" : (d > 99 ? "#E0E089" : "#DDDDDD");
         else
            return d > 99.5 ? "#2DAEE1" : (d > 99 ? "#EOE089" : "CCC");
      }

      function highlightCells(d, i, j) {

         var index = j;

         return cells.select('rect')
            .select(function(d, ix, jx) {
               return (index == ix || index == jx ? this : null);
            })
            .style('fill', function(d) { return getColor(d, true); }) 
            .style('cursor', 'nwse-resize');
      }  

      function unhighlightCells(d, i, j) {

         return cells.select("rect")
            .style("fill", function(d) { return getColor(d, false); }); 

      }

      function updateScore() {

      }

      function updateScore() {

      }

      function destroy(){
         svg.
            style('opacity',1)
            .transition()
            .duration(200)
            .style('opacity',0)
            .remove();
      };


      return {
         onDragEnd: onDragEnd,
         destroy: destroy

      };

   };

   return {
      newGame: newGame
   };

})();
