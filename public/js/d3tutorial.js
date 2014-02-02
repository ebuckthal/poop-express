angular.module('d3tutorial', []).directive('tutorial', function() {

return {

   restrict: "E",
   link: function(scope, element, attrs) {

      POOPSLIDE.init({
         idSVG: "#tutorial",
         onSlideChange: function(slides, currentIndex) {
            console.log(currentIndex);
         }
      });

      POOPSLIDE.addSlide({
         data: {
            rect: [
            ],
            text: [
               { id: 't1', 
                 text: 'POOPSNOOP is a tool for clustering E. coli into strains.',
                 x: 500,
                 y: 300
                 }
            ]
         },
         onEnter: function(data) {
            game = POOPSNOOP.newGame({
               idSVG: "#tutorial",
               data: [[100,100,100],[100, 0, 0], [0,100, 0]],
               gameSize: 400,
               gameTop: 50,
               gameLeft: 50,
               onDragEnd: function(cells, orient, domain, cellSize) {
                  console.log(cells);
                  console.log('here');
               },
            });

         },
         onRemove: function(data) {
            console.log("on remove");

            game.destroy();
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
            ]
         }
      });

      function nextSlide() {

         POOPSLIDE.nextSlide();
         updateButtons();

         console.log('here');
      }

      function prevSlide() {

         POOPSLIDE.prevSlide();
         updateButtons();
      }

      function updateButtons() {


         d3.select('#prev').attr('class', (POOPSLIDE.canPrev() ? "btn" : "btn disabled"));
         d3.select('#next').attr('class', (POOPSLIDE.canNext() ? "btn" : "btn disabled"));

      }

      //document.querySelector('#prev').addEventListener('click', prevSlide);
      //document.querySelector('#next').addEventListener('click', nextSlide);

      d3.select('#prev').on('click', prevSlide);
      d3.select('#next').on('click', nextSlide);
      

      nextSlide();

   }

};
});
