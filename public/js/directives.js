angular.module('directives', ['POOPSLIDE', 'POOPSNOOP', 'POOPEFFECTS', 'POOPNAV'])

.directive('tutorialcontainer', function(POOPSLIDE, POOPSNOOP, POOPEFFECTS) {
return {
   link : function(scope, element, attrs) {

      d3.select("#effects").datum({}); //must do to initialize datum for effects to use

      //BASIC MOVEMENT AND CLUSTERING
      POOPSLIDE.addSlide( //slide 0
         function() { 
            matrix = [[100,100,100,0],[100,100,0,0],[0,0,100,100],[100,100,0,100]];

            d3.select('#guide-text').call(POOPSLIDE.drawText, {text: 'This is <span class="term">POOPSNOOP</span>,<br>a tool to identify strains of <span class="term">E. coli</span>.'});

            d3.select('#help-text')
               .call(POOPSLIDE.drawText, {text: '<span class="term">Click and drag</span> a colored tile along <span class="term hi">diagonal</span>.'}, 500);

            d3.select('#game').call(POOPSNOOP.init, matrix, { gameSize: 500, orient: [0,1,2,3] });

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });


            d3.select("#effects")
               .call(POOPEFFECTS.highlightDiagonal);
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );



      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'There are rows and columns which intersect at tiles. The order of rows and columns is linked.<br>Rearranging the puzzle affects both rows and columns.' });

            d3.select('#help-text')
               .call(POOPSLIDE.drawText, {text: 'Try another <span class="term">Click and drag</span>.'}, 500);

            d3.select("#effects")
               .call(POOPEFFECTS.drawRowColLabels, [0,1,2,3]);

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });


         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
            d3.select("#effects")
               .call(POOPEFFECTS.removeHighlights);
         }
      ); 

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text').call(POOPSLIDE.drawText, {text: 'Rows and columns represent <span class="term">samples</span> of <span class="term">E. coli</span>. Where the rows and columns meet is a color indicating a <span class="term yes">match</span> or not.' })

            d3.select('#help-text')
               .call(POOPSLIDE.drawText, {text: '<span class="term">Click and drag</span> again.'}, 500);

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
            d3.select('#help-text')
               .call(POOPSLIDE.drawText, {});
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'The goal of <span class="term">POOPSNOOP</span> is to cluster <span class="term yes">matching</span> samples of <span class="term">E. coli</span>. Rearrange this puzzle to make a cluster of <span class="term yes">matches</span>.'})


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
               .call(POOPSLIDE.drawText, {text: 'Excellent! You clustered two <span class="term">samples</span>. Because the order of rows and columns is consistent, all clusters must form perfect squares along the <span class="term">diagonal</span>.'});

            d3.select('#effects').call(POOPEFFECTS.removeHighlights);
            d3.select("#effects").call(POOPEFFECTS.highlightGroup, 500, 4, 2, 3);

            d3.select("#effects")
               .call(POOPEFFECTS.drawCellHighlights, [{x: 1, y: 1}, {x: 0, y: 0}, {x: 0, y: 1}, {x:1, y:0}]);

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

            d3.select("#effects")
               .call(POOPEFFECTS.drawCellHighlights, []);

            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addInnerSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Good job! Keep in mind that clusters can be formed anywhere along the diagonal.'});
            d3.select('#help-text')
               .call(POOPSLIDE.drawText, {text: 'Click any tile to continue.'}, 500);

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });

         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      //3 UNDERSTANDING CLUSTERING
      POOPSLIDE.addSlide(
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'In addition to <span class="term yes">Matches</span> and <span class="term no">NON-MATCHES</span>, two samples can <span class="term maybe">POSSIBLY MATCH</span>. A cluster with more <span class="term yes">Matches</span> is prefferable to a cluster with <span class="term maybe">possible matches</span>.' });

            matrix = [[100,100,100,0],[100,100,0,0],[0,0,100, 99.1],[99.1,99.1,0,100]];
            d3.select("#game").call(POOPSNOOP.updateData, matrix); 
            
            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });

         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Samples along the <span class="term hi">diagonal</span> will always <span class="term yes">match</span> because they are being compared to themselves.'});

            d3.select("#effects")
               .call(POOPEFFECTS.highlightDiagonal);

            ;
            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
            d3.select("#effects")
               .call(POOPEFFECTS.removeHighlights);

         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Sample 1 <span class="term yes">matches</span> itself here.' }) 
            ;
         
            d3.select("#effects")
               .call(POOPEFFECTS.drawRowColHighlights, [1]);

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );
      
      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'The <span class="term hi">diagonal</span> splits the puzzle into two distinct sections. For instance, <span class="term">sample 0</span> is compared to <span class="term">sample 2</span> at two <span class="term hi">highlighted</span> positions. One is a <span class="term yes">match</span>, one is <span class="term">not</span>.'});

            d3.select("#effects")
               .call(POOPEFFECTS.drawRowColHighlights, []);

            d3.select("#effects")
               .call(POOPEFFECTS.highlightDiagonal);

            d3.select("#effects")
               .call(POOPEFFECTS.drawCellHighlights, [{x: 0, y: 2}, {x: 2, y: 0}]);

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();

         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Why does comparing the same sample twice not have the same result? Science time! Each <span class="term">sample</span> of E. coli has two <span class="term">pieces of DNA</span> associated with it.'});

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'The bottom-left quadrant compares the <span class="term">piece of dna</span> called the <span class="term">16s - 23s region</span>. The top-right quadrant compares the <span class="term">23s - 5s region</span>.' });

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();

         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Here at <span class="term">POOPSNOOP</span>, we are interested in creating clusters of samples that match in both dimensions, like <span class="term">samples 1 and 0</span>.' });

            d3.select("#effects")
               .call(POOPEFFECTS.drawCellHighlights, [{x: 1, y: 0}, {x: 0, y: 1}]);

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'A perfect square <span class="term">cluster</span> of <span class="term yes">Matches</span> and <span class="term maybe">possible matches</span> translates to a cluster of E. coli samples that all match each other in both <span class="term">pieces of DNA</span>.' });

            POOPSNOOP.setOnDragEnd(function() { POOPSLIDE.gotoNextSlide(); });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();

            d3.select("#effects")
               .call(POOPEFFECTS.drawCellHighlights, [])
               .call(POOPEFFECTS.removeHighlights)
               .call(POOPEFFECTS.drawRowColLabels, []);
            d3.select('#help-text')
               .call(POOPSLIDE.drawText,{});
         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 
            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Bigger puzzles may have multiple cluters. Solve this puzzle by making two large clusters! Remember, they must form squares along the diagonal.' });

            matrix = [[100,100,100,0,0,0,99.5],
                      [100,100,100,0,0,0,99.5],
                      [100,100,100,0,0,0,99.5],
                      [0,100,0,99.5,100,99.5,0],
                      [0,0,0,99.5,100,100,100],
                      [0,0,0,99.5,100,100,100],
                      [99.5,0,0,100,100,100,100]];
            d3.select('#game').call(POOPSNOOP.init, matrix, { gameSize: 500, orient: [1,6,3,2,5,4,0] });


            POOPSNOOP.setOnDragEnd(function() { 
               d3.select('#game')
                  .call(POOPSNOOP.calcScore)
                  .call(POOPSNOOP.colorAllData)
                  .transition()
                  .delay(500)
                  .call(POOPSNOOP.removeGood)
                  .call(POOPSNOOP.colorAllData);

               //console.log(POOPSNOOP.currentScore);
               d3.select('#help-text')
                  .call(POOPSLIDE.drawText,{text: 'The green cells show the clusters of your current solution.'});
               
               if(POOPSNOOP.currentScore > 12) {
                  POOPSLIDE.gotoNextSlide();
               }

            });
         }, 
         function() { 
            POOPSNOOP.setOnDragEnd();

            d3.select('#help-text')
               .call(POOPSLIDE.drawText, {});

         }
      );

      POOPSLIDE.addSlide( //slide 1
         function() { 

            d3.select('#guide-text')
               .call(POOPSLIDE.drawText, {text: 'Now you\'re ready for action! Choose from the list of puzzles and cluster those E. coli!'});

         }, 
         function() { 
         }
      );
      
   POOPSLIDE.gotoNextSlide();

   }

}
});
