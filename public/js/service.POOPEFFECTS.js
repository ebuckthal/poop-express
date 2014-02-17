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

   function drawRowColHighlight(sel, gameSize, numRows) {

      var d = [];

      for(var i = 0; i < numRows; i++) {
         d.push(i);
      }

      var domain = d3.scale.ordinal().rangeBands([0, gameSize], 0.1, 0.15).domain(d);
      var cellSize = 0.9 * (domain(1) - domain(0));

      for(var i = 0; i < numRows; i++) {

         this
            .insert('rect')
            .attr('class', 'highlight')
            .attr('height', gameSize+10)
            .attr('width', 3)
            .style('fill', '#E8573F')
            .attr('transform', 'translate(' + (domain(i) + (0.5 * cellSize)) + ', 0)')
            .style('opacity', 0)
         ;

         this
            .insert('rect')
            .attr('class', 'highlight')
            .attr('height', 3)
            .attr('width', gameSize+10)
            .style('fill', '#E8573F')
            .attr('transform', 'translate(0,' + (domain(i) + (0.5 * cellSize)) + ')')
            .style('opacity', 0)
         ;
      }

      this
         .selectAll('.highlight')
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
      removeHighlights: removeHighlights
   }

});
