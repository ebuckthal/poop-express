angular.module('POOPEFFECTS', [])

.service('POOPEFFECTS', function() {
   function highlightGroup(sel, gameSize, numRows, firstRow, lastRow) {

      var d = [];

      for(var i = 0; i < numRows; i++) {
         d.push(i);
      }

      var domain = d3.scale.ordinal().rangeBands([0, gameSize], 0.1, 0.15).domain(d);
      var cellSize = 0.9 * (domain(1) - domain(0));

      var highlightSize = lastRow - firstRow + 1;

      this
         .insert('rect')
         .attr('class', 'highlight')
         .attr('height', domain(lastRow) + cellSize - domain(firstRow) + 14)
         .attr('width', domain(lastRow) + cellSize - domain(firstRow) + 14)
         .attr('transform', 'translate(' + (domain(firstRow)-7) + ',' + (domain(firstRow)-7) + ')')
         .style('fill-opacity', 0)
         .style('stroke-opacity', 0)
         .style('stroke-width', 4)
         .style('stroke', '#23c897')
         .style('pointer-events', 'none')
         .transition()
         .duration(200)
         .style('stroke-opacity', 1)
      ;

   }

   function drawOrientNumbers(sel) {

   }

   function drawRowColHighlights(sel, indexArrayToDraw) {

      if(indexArrayToDraw !== undefined) {
         d3.select("#effects").datum({ indexArray: indexArrayToDraw });
      }

      if(d3.select("#effects").datum() === undefined) {
         return;
      }


      var indexArray = d3.select("#effects").datum().indexArray;

      var datum = d3.select("#game").datum();

      var offsetArray = [];

      for(var i = 0; i < indexArray.length; i++) {
         offsetArray.push(datum.drawDomain[indexArray[i]]);
      }

      var vert = this
         .selectAll('.vert')
         .data(offsetArray)
      ;
      
      vert
         .attr('transform', function(d) {
               return 'translate(' + ((d) + (0.5 * datum.cellSize) - 5) + ',0)';
            })
      ;

      vert
         .enter()
         .insert('rect')
         .attr('class', 'vert rc-highlight')
         .attr('height', datum.gameSize+10)
         .attr('width', 10)
         .style('fill', '#E8573F')
         .style('opacity', 0)
         .style('pointer-events', 'none')
         .attr('transform', function(d) { 
               return 'translate(' + ((d) + (0.5 * datum.cellSize) - 5) + ', 0)';
            })
         .transition()
         .delay(function(d, i) { return i * 200 })
         .duration(200)
         .style('opacity', 0.8)
      ;

      var hori = this
         .selectAll('.hori')
         .data(offsetArray)
      ;

      hori
         .attr('transform', function(d) {
               return 'translate(0,' + ((d) + (0.5 * datum.cellSize) - 5) + ')';
            })
      ;

      hori
         .enter()
         .insert('rect')
         .attr('class', 'hori rc-highlight')
         .attr('height', 10)
         .attr('width', datum.gameSize+10)
         .style('fill', '#E8573F')
         .style('opacity', 0)
         .style('pointer-events', 'none')
         .attr('transform', function(d) {
               return 'translate(0,' + ((d) + (0.5 * datum.cellSize) - 5) + ')';
            })
         .transition()
         .delay(function(d, i) { return i * 200 })
         .duration(200)
         .style('opacity', 0.8)

      ;

   }

   function removeHighlights(sel) {
      this.selectAll('.highlight').data([]).exit().remove();
   }

   function drawWordHighlights(sel, gameSize, numRows, words) {
      var d = [];

      for(var i = 0; i < numRows; i++) {
         d.push(i);
      }

      var domain = d3.scale.ordinal().rangeBands([0, gameSize], 0.1, 0.15).domain(d);
      var cellSize = 0.9 * (domain(1) - domain(0));

      var h = [{x: 1, y:1, t: 'MATCH'},{x: 0, y: 2, t: 'POSSIBLE'}, {x: 3, y: 1, t: 'NO MATCH'}];

      this
         .selectAll('.highlight')
         .data(h, function(d) { return d.t })
         .enter()
         .append('foreignObject')
         .attr('class', 'highlight')
         .html(function(d) { return '<span style="color: black;" class="text-match">' + d.t + '</span>' })
         .attr('transform', function(d) {
            return 'translate(' + (domain(d.x) + (0.5 * cellSize)) + ',' + (domain(d.y) + (0.5 * cellSize)) + ')';
         })
         .attr('height', 600)
         .attr('width', 600)
         .style('opacity', 0)
         .transition()
         .duration(200)
         .style('opacity', 1)
      ;
   }

   return {
      highlightGroup: highlightGroup,
      removeHighlights: removeHighlights,
      drawRowColHighlights: drawRowColHighlights
   }

});
