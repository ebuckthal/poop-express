angular.module('d3tutorial', []).directive('tutorial', function() {

return {

   restrict: "E",
   link: function(scope, element, attrs) {

      POOPSLIDE.init({
         idSVG: "#tutorial",
         onSlideChange: function(slides, currentIndex) {
         }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: '<span class="term">POOPSNOOP</span> is a tool for clustering E. coli samples into strains. A strain is a group of genetically similar E. coli.',
                 x: 100,
                 y: 575
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,99.5,100,100], [0,100,0,0], [99.5,0,100,100], [100,0,99.5,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50
               }
            ]
         },
         onEnter: function(data) {
            console.log('on enter slide 0');
         },
         onRemove: function(data) {
            console.log("on remove slide 0");
         }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'This puzzle is constructed of <span class="term rc">rows and columns</span><br>representing E. coli samples. The same four samples in this example are being compared to each other.',
                 x: 100,
                 y: 575,
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,100,100,0], [0,100,100,100], [100,0,100,100], [100,100,0,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50
               }
            ]
         },
         onEnter: 
            function(data) {

               for(var i = 0; i < data.game[0].data.length; i++) {

                  d3.select('.game')
                     .insert('rect')
                     .attr('class', 'highlight')
                     .attr('height', 490)
                     .attr('width', 3)
                     .style('fill', '#E8573F')
                     .attr('transform', 'translate(' + (122*i + 60) + ', 0)')
                     .style('opacity', 0)
                  ;

                  d3.select('.game')
                     .insert('rect')
                     .attr('class', 'highlight')
                     .attr('height', 3)
                     .attr('width', 490)
                     .style('fill', '#E8573F')
                     .attr('transform', 'translate(0,' + (122*i + 60) + ')')
                     .style('opacity', 0)
                  ;
               }

               d3.select('.game').selectAll('.highlight')
                  .transition()
                  .delay(function(d, i) { return i * 200 })
                  .duration(200)
                  .style('opacity', 0.8)
               ;

               d3.select('.game')
                  .transition()
                  .duration(100)

               

         },
         onRemove: function(data) {

               d3.select('.game').selectAll('.highlight')
                  .remove()
               ;
         }
            

      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'Where a row and column meet, there is a color indicating where those samples <span class="term yes">match</span>, <span class="term maybe">possibly match</span>, or <span class="term no">do not match</span>.',
                 x: 100,
                 y: 575,
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,97,100,0], [0,100,100,97], [97,0,100,97], [100,100,0,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50
               }
            ]
         },
         onEnter: 
            function(data) {

               var h = [{x: 1, y:1, t: 'MATCH'},{x: 0, y: 2, t: 'POSSIBLE'}, {x: 3, y: 1, t: 'NO MATCH'}];

               var d = d3.select('.game')
                  .selectAll('.highlight')
                  .data(h, function(d) { return d.t; })
               ;

               d.enter()
                  .append('text')
                  .attr('class', 'highlight')
                  .attr('text-anchor', 'middle')
                  .text(function(d) { return d.t; })
                  .attr('x', 0)
                  .attr('y', 0)
                  .style('font-family', 'Source Sans Pro')
                  .style('font-size', '20px')
                  .style('fill', '#000')
                  .attr('transform', function(d) { 
                     return 'translate(' + (d.x*122 + 63) + ',' + (d.y*122 + 90) + ')'
                  })
                  .style('opacity', 0)
                  .transition()
                  .duration(200)
                  .delay(function(d, i) { return 200 + 400 * i; })
                  .style('opacity', 1)
                  .ease('bounce')
                  .attr('transform', function(d) { 
                     return 'translate(' + (d.x*122 + 63) + ',' + (d.y*122 + 70) + ')'
                  })
               ;


            },
         onRemove:
            function(data) {

               var d = d3.select('.game')
                  .selectAll('.highlight')
                  .data([])
               ;

               d.exit().remove();
            }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'The goal of <span class="term">POOPSNOOP</span> is to group as many matching samples into as few groups as possible.',
                 x: 100,
                 y: 575,
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,100,100,0], [0,100,100,100], [100,0,100,100], [100,100,0,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50,
                 onDragEnd: function() {

                    console.log('lol');
                 }
               }
            ]
         },
         onEnter:
            function() {

               function helperText() {


                  d3.select('#tutorial')
                     .data([{ id: '1', text: 'Click the top row and drag it into the red box.', x: 50, y: 50}])
                     .append('foreignObject')
                     .attr('class', 'text-slide')
                     .attr('class', 'highlight')
                     .html(function(d) { return '<span class="text-box" id="' + d.id + '">' + d.text + '</span>'})
                     .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }) 
                     .attr('width', 600)
                     .attr('height', 600)
                     .style('opacity', 0)
                     .transition()
                     .duration(200)
                     .delay(3000)
                     .style('opacity', 1)

               }

               //TODO
               //d3.select('.game')
                  //.call(POOPSNOOP.setOnDragEnd, function() { console.log(onDragEnd); });

               d3.select('#tutorial')
                  .selectAll('.highlight')
                  .data([1])
                  .enter()
                  .append('rect')
                  .attr('class', 'highlight')
                  .attr('height', 234)
                  .attr('width', 234)
                  .style('fill', 'none')
                  .style('stroke', '#E8573F')
                  .style('stroke-width', '3px')
                  .style('opacity', 0)
                  .attr('transform', function(d) { 
                     return 'translate(400,300)'
                  })
                  .transition()
                  .duration(200)
                  .style('opacity', 0.7)
                  .transition()
                  .delay(3000)
                  .duration(400)
                  .call(helperText)
                  .ease('bounce')
                  .attr('transform', function(d) { 
                     return 'translate(278,178)'
                  })
                  .attr('height', 356)
                  .attr('width', 356)
               ;

            },
         onRemove:
            function () {

               d3
                  .selectAll('.highlight')
                  .remove()
               ;

            }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'A puzzle is a comparison of a set of samples to the same set of samples. The diagonal always matches itself.',
                 x: 100,
                 y: 575,
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,100,100,0], [0,100,100,100], [100,0,100,100], [100,100,0,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50
               }
            ]
         }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'The upper quadrant and lower quadrant are not symmetrical because <span class="term">POOPSNOOP</span> compares two different, but corresponding, DNA fragments of each sample.',
                 x: 100,
                 y: 575,
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,100,100,0], [0,100,100,100], [100,0,100,100], [100,100,0,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50
               }
            ]
         }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'To solve <span class="term">POOPSNOOP</span>, grab a row or column and drag it. The order of rows and columns must match. Dragging in one direction automatically affects the other.',
                 x: 100,
                 y: 575
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,100,100,0], [0,100,100,100], [100,0,100,100], [100,100,0,100]],
                 gameSize: 500,
                 x: 150,
                 y: 50
               }
            ]
         }
      });

      function nextSlide() {

         POOPSLIDE.nextSlide();
         updateButtons();
      }

      function prevSlide() {

         POOPSLIDE.prevSlide();
         updateButtons();
      }

      function updateButtons() {

         if(POOPSLIDE.canPrev()) {
            d3.select('#prev').on('click', prevSlide);
            d3.select('#prev').attr('class', "btn");
         } else {
            d3.select('#prev').on('click', null);
            d3.select('#prev').attr('class', "btn disabled");
         }

         if(POOPSLIDE.canNext()) {
            d3.select('#next').on('click', nextSlide);
            d3.select('#next').attr('class', "btn");
         } else {
            d3.select('#next').on('click', null);
            d3.select('#next').attr('class', "btn disabled");

         }


      }

      nextSlide();

   }

};
});
