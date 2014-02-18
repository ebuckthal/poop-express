angular.module('POOPSNOOP', ['POOPSLIDE', 'POOPEFFECTS'])

.service('POOPSNOOP', function(POOPSLIDE, POOPEFFECTS) {

   Array.prototype.compare = function (array) {
      // if the other array is a falsy value, return
      if (!array)
         return false;

      // compare lengths - can save a lot of time
      if (this.length != array.length)
         return false;

      for (var i = 0, l=this.length; i < l; i++) {
         // Check if we have nested arrays
         if (this[i] instanceof Array && array[i] instanceof Array) {
               // recurse into the nested arrays
               if (!this[i].compare(array[i]))
                  return false;
         }
         else if (this[i] != array[i]) {
               // Warning - two different object instances will never be equal: {x:20} != {x:20}
               return false;
         }
      }
      return true;
   }

   var onDragEnd;

   function init(selection, matrix, options) {

      var d = [];

      for(var i = 0; i < options.orient.length; i++) {
         d.push(i);
      }

      options.domain = d3.scale.ordinal().rangeBands([0, options.gameSize], 0.1, 0.15).domain(d);
      options.cellSize = 0.9 * (options.domain(1) - options.domain(0));

      options.drawDomain = [];

      for(var i = 0; i < d.length; i++) {
         options.drawDomain.push(options.domain(i));
      };

      this
         .datum(options) //{ gameSize: 400, orient: [0,1,2] })

      var rows = this
         .selectAll('.row')
         .data(matrix)
      ;
      
      rows
         .enter()
         .append('g')

      var cells = rows
         .attr('class', 'row')
         .selectAll('.cell')
         .data(function(d) { return d; })
      ;

      cells.enter()
         .append('rect');

      cells
         .attr('class', 'cell')
         .attr('width', options.cellSize)
         .attr('height', options.cellSize)
         //.style('stroke-width', '2px')
         //.style('stroke', 'white')
         .attr('rx', options.cellSize * 0.05)
         .attr('ry', options.cellSize * 0.05)
         .attr('row', function(d, i, j) { return j; })
         .attr('col', function(d, i, j) { return i; })
         .on("mouseenter", highlightCells) 
         .on("mouseleave", unhighlightCells) 
         .call(d3.behavior.drag().on('dragstart', dragStart).on('drag', drag).on('dragend', dragEnd));
      ;

      this
         .call(colorAllData)
         .call(drawDomainAll)

   };


   function drawDomainAll() {
      
      var datum = d3.select('#game').datum();

      this
         .selectAll('.row')
         .selectAll('.cell')
         .attr('transform', function(d, i, j) {
            return "translate(" + datum.drawDomain[i] + 
            "," + datum.drawDomain[j] + ")"; 
         })

   }

   function removeGood(sel) {
      
      this
         .selectAll('.good')
         .classed('good', false);
   }

   function colorAllData(sel) {

      this
         .selectAll('.row')
         .selectAll('.cell')
         .call(colorAll, false);
   };

   function colorAll(sel, highlight) {

      this
         .filter(function() { return this.classList.contains('good') == false; })
         .style('fill', function(d, i, j) {

            if(highlight) {
               return d > 99.5 ? "#78D9FF" : (d > 99 ? "#E0E089" : "#f0f0f0");
            } else {
               return d > 99.5 ? "#2DAEE1" : (d > 99 ? "#E0E089" : "#DDD");
            }
         })
   };

   function dragStart(d, i, j) {

      d3.select("#game").datum().selected = j;

      setSwapBounds();

      d3.select('#game')
         .selectAll('.row')
         .selectAll('.cell')
         .on("mouseenter", null)
         .on("mouseleave", null)
      ;

      /* TODO
      d3.select('#game')
         .selectAll('.row')
         .selectAll('.cell')
         .select(function(d, ix, jx) { return i == jx || j == jx ? this : null  })
         .moveToFront();
      */
   };

   //set datum.swap to know when we want to swap
   //update datum.orient to reflect current orientation
   function doSwap(swapRight) {
      var datum = d3.select('#game').datum();
      
      var selectedIndex = datum.orient.indexOf(datum.selected); 

      var otherIndex = swapRight ? selectedIndex+1 : selectedIndex-1;

      var tmp = datum.orient[selectedIndex];
      datum.orient[selectedIndex] = datum.orient[otherIndex];
      datum.orient[otherIndex] = tmp;

      //this is some magic to override the normal transition function to change our drawDomain element
      //instead. It calls POOPEFFECTS.drawRowColHighlights and drawDomainAll for each iteration of interpolation
      d3.select("#game")
         .selectAll('.row')
         .select(function(d, i) { return (i == datum.selected ? null : this); })
         .transition()
         .tween('draw', function(d, ix) {
            var i = d3.interpolate(datum.drawDomain[ix], datum.domain(datum.orient.indexOf(ix)));

            return function (t) {

               datum.drawDomain[ix] = i(t); //datum.domain(selectedIndex);

               d3.select("#game").call(drawDomainAll);
               d3.select("#effects").call(POOPEFFECTS.drawRowColHighlights);

            };
         })

      setSwapBounds();
   }

   function setSwapBounds() {
      var datum = d3.select('#game').datum();
      var selectedIndex = datum.orient.indexOf(datum.selected); 

      datum.swap = [datum.domain(selectedIndex), datum.domain(selectedIndex+1)];
   }
   
   function drag(d, i, j) {

      var datum = d3.select('#game').datum();

      var mousePosition = d3.mouse(this.parentNode);
      var drawPosition = Math.min(Math.max(0, mousePosition[1]-(datum.cellSize/2)), datum.gameSize-datum.cellSize);

      datum.drawDomain[datum.selected] = drawPosition;

      if(mousePosition[1] < datum.swap[0] &&
            datum.orient.indexOf(datum.selected) > 0) { //swap left

         doSwap(false);

      } else if(mousePosition[1] > datum.swap[1] 
            && datum.orient.indexOf(datum.selected) < datum.orient.length-1) { //swap right

         doSwap(true);
      }

      d3.select('#game')
         .call(drawDomainAll)
      ;

      d3.select("#effects")
         .call(POOPEFFECTS.drawRowColHighlights)
      ;

   };

   function endall(transition, callback) { 
      var n = 0; 
      transition 
         .each(function() { ++n; }) 
         .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
   } 

   function dragEnd() {

      var datum = d3.select("#game").datum();
      var selectedIndex = datum.orient.indexOf(datum.selected); 
      
      datum.drawDomain[datum.selected] = datum.domain(selectedIndex);

      d3.select("#effects")
         .call(POOPEFFECTS.drawRowColHighlights);

      d3.select("#game")
         .selectAll('.row')
         .selectAll('.cell')
         .on("mouseenter", highlightCells)
         .on("mouseleave", unhighlightCells)
      ;

      d3.select("#game")
         .call(drawDomainAll)
         .call(onDragEnd || function() { console.log('ondragend not defined'); });

   };

   function calcScore() {

      var datum = this.datum();

      var cells = this
         .selectAll('.row')
         .selectAll('.cell');

      
      for(var startIndex = 0; startIndex < datum.orient.length; startIndex++) {

         var squareSize;

         for(squareSize = 2; squareSize <= datum.orient.length-startIndex; squareSize++) {

            var isACluster = true;

            var square = cells
               .select(function(d, i, j) {
                  return (datum.orient.indexOf(i) >= startIndex &&
                     datum.orient.indexOf(i) < startIndex + squareSize &&
                     datum.orient.indexOf(j) >= startIndex &&
                     datum.orient.indexOf(j) < startIndex + squareSize) ? this : null;
               })
               .each(function(d, i, j) {
                  isACluster = (d > 99 ? isACluster : false);
               });


            if(!isACluster) {
               break;
            }

            square.classed('good', true);

         }

         //console.log('found: square of size ' + (squareSize-1) + ' at ' + startIndex);
      }

   }

   function highlightCells(d, i, j) {

      var index = j;

      d3.select('#game')
         .selectAll('.row')
         .selectAll('.cell')
         .select(function(d, ix, jx) {
            return (index == ix || index == jx ? this : null);
         })
         .call(colorAll, true)
         .style('cursor', 'nwse-resize');
   }  

   function unhighlightCells(d, i, j) {

      var index = j;

      d3.select('#game')
         .selectAll('.row')
         .selectAll('.cell')
         .select(function(d, ix, jx) {
            return (index == ix || index == jx ? this : null);
         })
         .call(colorAll, false)
   };

   function setOnDragEnd(fn) {
      onDragEnd = fn;
   };


   return {
      init: init,
      setOnDragEnd: setOnDragEnd,
      colorAllData: colorAllData,
      calcScore: calcScore,
      removeGood: removeGood,
      highlightCells: highlightCells
   }

});
