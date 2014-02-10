function initBoard(selection, options) {

   var d = [];

   for(var i = 0; i < options.size; i++) {
      d[i] = [];

      for(var j = 0; j < options.size; j++) {
         d[i].push(j);
      }
   }
   options.domain = d3.scale.ordinal().rangeBands([0, options.gameSize], 0.1, 0.15).domain(d[0]);
   options.cellSize = options.gameSize / options.size - (0.2 * options.gameSize / options.size);

   console.log(d);

   this
      .datum(options)
      .append('rect')
      .attr('class', 'back')
      .attr('width', options.gameSize)
      .attr('height', options.gameSize)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('fill', '#ddd')
   ;

   this
      .selectAll('.back-row')
      .data(d)
      .enter()
      .append('g')
      .attr('class', 'back-row')
      .selectAll('.back-cell')
      .data(function(d) { return d; })
      .enter()
      .append('rect')
      .attr('class', 'back-cell')
      .attr('width', options.cellSize*1.13)
      .attr('height', options.cellSize*1.13)
      .attr('rx', options.cellSize * 0.05)
      .attr('ry', options.cellSize * 0.05)
      .style('fill', '#AAA')
      .attr("transform", function(d, i, j) { 
         return "translate(" + (options.domain(i)-options.cellSize*0.03) + 
         "," + (options.domain(j)-options.cellSize*0.03) + ")"; 
   })
   ;

}

function init(selection, options) {

   var d = [];

   for(var i = 0; i < options.orient.length; i++) {
      d.push(i);
   }

   options.domain = d3.scale.ordinal().rangeBands([0, options.gameSize], 0.1, 0.15).domain(d);
   options.cellSize = 0.9 * (options.domain(1) - options.domain(0));
   //options.cellSize = options.gameSize / options.orient.length - (0.2 * options.gameSize / options.orient.length);

   this
      .datum(options) //{ gameSize: 400, orient: [0,1,2] })
      .selectAll('.row')
      .data(matrix)
      .enter()
      .append('g')
      .attr('class', 'row')
      .selectAll('.cell')
      .data(function(d) { return d; })
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('width', options.cellSize)
      .attr('height', options.cellSize)
      .attr('rx', options.cellSize * 0.05)
      .attr('ry', options.cellSize * 0.05)
      .attr('row', function(d, i, j) { return j; })
      .attr('col', function(d, i, j) { return i; })
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

function colorAll(sel, highlight) {

   this
      .style('fill', function(d, i, j) {

         if(highlight) {
            return d > 99.5 ? "#33C5FF" : (d > 99 ? "#E0E089" : "#EEE");
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
         .call(drawAll);

   } else if(mousePosition[1] > datum.swap[1]) { //swap right

      d3.select('#game')
         .call(swapOrient, datum.selectedIndex, datum.selectedIndex+1)
         .call(setSwapBounds)
         .selectAll('.row')
         .selectAll('.cell')
         .select(function(d, i, j) { return i != datum.selected && j != datum.selected ? this : null })
         .transition()
         .call(drawAll);
   }
};

function dragEnd() {

   d3.select("#game")
      .selectAll('.row')
      .selectAll('.cell')
      .transition()
      .call(drawAll)
   ;

};


var matrix = [[100,100,100, 0],[100, 100, 0, 0], [100, 0, 100, 0], [100, 0, 0, 100]];

d3.select('#game')
   .call(init, { gameSize: 600, orient: [0,1,2,3] })
;

d3.select('#board')
   //.call(initBoard, { gameSize: 400, size: 4 })
;

/*d3.select('#game').datum().orient = [1, 2, 0];

console.log(d3.select('#game').datum());

d3.select('#game')
   .transition()
   .delay(400)
   .duration(200)
   .call(drawAll)
;
*/
