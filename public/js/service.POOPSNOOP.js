angular.module('POOPSNOOP', ['POOPSLIDE'])

.service('POOPSNOOP', function(POOPSLIDE) {

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

      console.log('here');

      var d = [];

      for(var i = 0; i < options.orient.length; i++) {
         d.push(i);
      }

      options.domain = d3.scale.ordinal().rangeBands([0, options.gameSize], 0.1, 0.15).domain(d);
      options.cellSize = 0.9 * (options.domain(1) - options.domain(0));

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
         .selectAll('.row')
         .selectAll('.cell')
         .call(drawAll)
         .call(colorAll, false)
      ;

   };

   function drawAll() {

      var datum = d3.select('#game').datum();

      this
         .attr("transform", function(d, i, j) { 
            return "translate(" + (datum.domain(datum.orient.indexOf(i))) + 
            "," + (datum.domain(datum.orient.indexOf(j))) + ")"; 
      })
   };

   function drawDrag(sel, mousePosition) {

      var datum = d3.select("#game").datum();
      var drawPosition = Math.min(Math.max(0, mousePosition[1]-(datum.cellSize/2)), datum.gameSize-datum.cellSize);

      this
         .attr("transform", function(d, i, j) { 
            if(j == datum.selected && i == datum.selected) {

               return "translate(" + drawPosition + "," + drawPosition + ")"; 
            } else if(j == datum.selected) {
               
               return "translate(" + (datum.domain(datum.orient.indexOf(i))) + "," + drawPosition + ")"; 
            } else if (i == datum.selected) {

               return "translate(" + drawPosition + "," + (datum.domain(datum.orient.indexOf(j))) + ")"; 
            }
      })
   };

   function colorAllTutorial(sel) {

      var colors = ['#00FF00', '#FF00FF', '#FF0000'];

      this
         .selectAll('.row')
         .selectAll('.cell')
         .style('fill', function(d, i, j) {
            return colors[i];
         })
   };

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

   function setSwapBounds(sel, index) {

      var datum = this.datum();

      if(index !== undefined) {
         datum.selected = index;
      }

      datum.selectedIndex = datum.orient.indexOf(datum.selected);

      datum.swap = [datum.domain(datum.selectedIndex)-1, datum.domain(datum.selectedIndex+1)+1];
   }

   function dragStart(d, i, j) {

      //determine swap positions
      d3.select('#game')
         .call(setSwapBounds, j) //grabs row

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

   function swapOrient(sel, ind1, ind2) {

      var datum = this.datum();

      var tmp = datum.orient[ind1];
      datum.orient[ind1] = datum.orient[ind2];
      datum.orient[ind2] = tmp;
   }

   function drag(d, i, j) {

      var datum = d3.select('#game').datum();
      var mousePosition = d3.mouse(this.parentNode);
      
      d3.select('#game')
         .selectAll('.row')
         .selectAll('.cell')
         .select(function(d, i, j) { return i == datum.selected || j == datum.selected ? this : null  })
         .call(drawDrag, mousePosition)

      if(mousePosition[1] < datum.swap[0] && datum.selectedIndex > 0) { //swap left

         d3.select('#game')
            .call(swapOrient, datum.selectedIndex, datum.selectedIndex-1)
            .call(setSwapBounds)
            .selectAll('.row')
            .selectAll('.cell')
            .select(function(d, i, j) { return i != datum.selected && j != datum.selected ? this : null })
            .transition()
            .duration(100)
            .call(drawAll);

      } else if(mousePosition[1] > datum.swap[1]) { //swap right

         d3.select('#game')
            .call(swapOrient, datum.selectedIndex, datum.selectedIndex+1)
            .call(setSwapBounds)
            .selectAll('.row')
            .selectAll('.cell')
            .select(function(d, i, j) { return i != datum.selected && j != datum.selected ? this : null })
            .transition()
            .duration(100)
            .call(drawAll);
      }
   };

   function endall(transition, callback) { 
      var n = 0; 
      transition 
         .each(function() { ++n; }) 
         .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
   } 

   function dragEnd() {

      d3.select("#game")
         .selectAll('.row')
         .selectAll('.cell')
         .on("mouseenter", highlightCells)
         .on("mouseleave", unhighlightCells)
         .transition()
         .call(drawAll)
         .call(endall, onDragEnd || function() { console.log('ondragend not defined'); });
      ;

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

         console.log('found: square of size ' + (squareSize-1) + ' at ' + startIndex);
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
      calcScore: calcScore
   }

});
