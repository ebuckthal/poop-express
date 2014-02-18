angular.module('directives', ['POOPSLIDE', 'POOPSNOOP', 'POOPEFFECTS'])

.directive('tutorialcontainer', ['POOPSLIDE', 'POOPSNOOP', 'POOPEFFECTS', function(POOPSLIDE, POOPSNOOP, POOPEFFECTS) {
return {
   link : function(scope, element, attrs) {



      POOPSLIDE.addSlide( //slide 0
         function() { 
            matrix = [[100,100,100,0],[100,100,0,0],[0,0,100,100],[100,100,0,100]];

            d3.select('#guide-text').call(POOPSLIDE.drawText, {text: 'This is POOPSNOOP. Click and drag a column or row along the diagonal to rearrange the puzzle.'});

            d3.select('#game').call(POOPSNOOP.init, matrix, { gameSize: 500, orient: [0,1,2,3] });

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Let\'s talk science. The diagonal splits the puzzle into two sections of sample comparison. For instance, sample 1 is compared to sample 2 at these four points.'});
               
            d3.select('#effects')
               .call(POOPEFFECTS.drawRowColHighlights, [0,1]);

         }, 
         function() { 

         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text').call(POOPSLIDE.drawText, {text: 'The rows and columns are linked so that they remain in the same order. Try another move to get the hang of it.' })
            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      ); 

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text').call(POOPSLIDE.drawText, {text: 'Each row and each column is a sample of E. coli. The tiles indicate the similarity of intersecting samples. Drag again to continue.' })

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Neat! The order of the rows must always match the order of the columns. Practice another drag.'})

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'The goal of POOPSNOOP is to create groups matching samples of E. coli. Rearrange this puzzle so that there are only blue tiles in highlighted area.'})

            d3.select("#effects").call(POOPEFFECTS.highlightGroup, 500, 4, 1, 2);

            POOPSNOOP.setOnDragEnd(function() {
               var targetOrient = [[3,0,1,2], [2,0,1,3], [3,1,0,2], [2,1,0,3]];
               var orient = d3.select('#game').datum().orient;

               if(orient.compare(targetOrient[0]) ||
                  orient.compare(targetOrient[1]) ||
                  orient.compare(targetOrient[2]) ||
                  orient.compare(targetOrient[3])) {

                     POOPSLIDE.gotoNextSlide();
               }
            });

         }, 
         function() { 
            d3.select('#effects').call(POOPEFFECTS.removeHighlights);

            POOPSNOOP.setOnDragEnd();
         }
      );


      POOPSLIDE.addInnerSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Excellent! You\'ve grouped two samples together! Because the order of rows and columns is consistent, all clusters must form perfect squares along the diagonal.'});

            d3.select('#game').call(POOPSNOOP.calcScore);
            d3.select('#game')
               .selectAll('.good')
               .transition()
               .duration(200)
               .style('fill', '#23c897')

            d3.select('#effects').call(POOPEFFECTS.removeHighlights);
            d3.select("#effects").call(POOPEFFECTS.highlightGroup, 500, 4, 2, 3);

            POOPSNOOP.setOnDragEnd(function() {
               var targetOrient = [[3,2,0,1], [2,3,0,1], [3,2,1,0], [2,3,1,0]];
               var orient = d3.select('#game').datum().orient;

               if(orient.compare(targetOrient[0]) ||
                  orient.compare(targetOrient[1]) ||
                  orient.compare(targetOrient[2]) ||
                  orient.compare(targetOrient[3])) {

                     POOPSLIDE.gotoNextSlide();
               }
            });
         }, 
         function() { 
            d3.select('#effects').call(POOPEFFECTS.removeHighlights);

            POOPSNOOP.setOnDragEnd();


            d3.select('#game').call(POOPSNOOP.removeGood);
            
            d3.select('#game')
               .transition()
               .duration(200)
               .call(POOPSNOOP.colorAllData);
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Good job! The same samples can be grouped anywhere along the diagonal. These two solutions are equivalent. Click to continue.'});

         }, 
         function() { 

         }
      );


   //goto first slide
   POOPSLIDE.gotoNextSlide();

   }


}
}]);
