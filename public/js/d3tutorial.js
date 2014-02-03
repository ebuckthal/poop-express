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
                 text: 'POOPSNOOP is a tool <br>for clustering E. coli into strains.',
                 x: 350,
                 y: 300
                 }
            ],
            game: [
               { id: '1', 
                 data: [[100,100,100], [0,100,100], [0,0,100]],
                 gameSize: 400,
                 x: 0,
                 y: 200,
                 onDragEnd: function(cells, orient, domain, cellSize) {
                     console.log('ondragend');
                 }
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
                 text: 'The board itself is organized of columns and rows',
                 x: 200,
                 y: 300
                 }
            ],
            game: [
              /* { id: '1', 
                 data: [[100,100,100], [0,100,100], [0,0,100]],
                 gameSize: 400,
                 x: 400,
                 y: 200,
                 onDragEnd: function(cells, orient, domain, cellSize) {
                     console.log('ondragend');
                 }
               }*/
            ]
         },
         onEnter: function(data) { 

         },
         onRemove: function(data) {
         }
            

      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', text: 'Here is another text box board indication matching samples in a group of E. coli' }
            ],
            game: [
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
         } else {
            d3.select('#prev').on('click', null);
         }

         if(POOPSLIDE.canNext()) {
            d3.select('#next').on('click', nextSlide);
         } else {
            d3.select('#next').on('click', null);

         }

         d3.select('#prev').attr('class', (POOPSLIDE.canPrev() ? "btn" : "btn disabled"));
         d3.select('#next').attr('class', (POOPSLIDE.canNext() ? "btn" : "btn disabled"));

      }

      nextSlide();

   }

};
});
