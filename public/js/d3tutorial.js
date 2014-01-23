angular.module('d3tutorial', []).directive('tutorial', function() {

return {

   restrict: "E",
   link: function(scope, element, attrs) {

      var height = 600;
      var width = 800;

      var currentInterval = null;

      var step = -1;
      var direction;


      var steps = [

         [
            [ { id: 'r1', width: '500px', height: '500px', rx: '5px', ry: '5px', x: '50px', fill: '#ccc' }],
            [ { text: 'POOPGAME is a puzzle game about identifying strains of E. coli.' } ]
         ],

         [
            [ { id: 'r1', width: '300px', height: '300px', rx: '10px', ry: '10px', x: '10px', fill: '#ccc' }],
            [ { text: 'Certain strains for E. coli are a major cause of foodborne bacterial diseases.', x: 45 } ]
         ],

         [
            [
               { id: 'r1', width: '300px', height: '300px', rx: '10px', ry: '10px', x: '10px', fill: '#ccc' },
               { id: 'r2', width: '50px', height: '30px', x: '400px', y: '100px', fill: "#D55332" },  
               { id: 'r3', width: '50px', height: '30px', x: '500px', y: '300px', fill: "#D55332" },  
               { id: 'r4', width: '50px', height: '30px', x: '600px', y: '500px', fill: "#D55332" },  

            
            ],
            [ 
               { text: 'In order to monitor populations of E. coli, Cal Poly has created a database of E. coli samples.' }, 
               { text: 'The database contains important information about the strains including location, date, and genetic data.' }
            ]
         ],

         [
            [
               { id: 'r1', width: '300px', height: '300px', rx: '10px', ry: '10px', x: '10px', fill: '#ccc' },
               { id: 'r2', width: '50px', height: '30px', x: '600px', y: '100px', fill: "#2daee1" },  
               { id: 'r3', width: '50px', height: '30px', x: '300px', y: '300px', fill: "#2daee1" },  
               { id: 'r4', width: '50px', height: '30px', x: '100px', y: '500px', fill: "#2daee1" },  
            ],
            [ 
               { text: "The purpose of Poop Snoop is to group the samples of E. coli into strains." },
               { text: "Researchers like to know when dangerous strains might be infecting bodies of water or crops." }
            ]
         ],


         [
            [ 
               { id: 'r1', width: '100px', height: '100px', rx: '30px', ry: '30px', x: '20px', y: '20px', fill: "#D55332" },
               { id: 'r2', width: '100px', height: '100px', rx: '30px', ry: '30px', x: '200px', y: '20px', fill: "#D55332" },
               { id: 'r3', width: '100px', height: '100px', rx: '30px', ry: '30px', x: '20px', y: '200px', fill: "#D55332" },
               { id: 'r4', width: '100px', height: '100px', rx: '30px', ry: '30px', x: '200px', y: '200px', fill: "#D55332" } 
            ],
            [

               { text: "Every E. coli sample has two important pieces of DNA." },
               { text: "We can compare E. coli samples by comparing these two pieces of DNA." }
            ]
         ],


         [
            [],
            [
               { text: "Each piece of DNA is either certain to match, certain to not match, or it is a potential match." }
            ]
         ],

         [
            [],
            [
               { text: "Each E. coli sample then compares both of its DNA pieces to both the DNA pieces of every other E. coli sample." }
            ]
         ],

         [
            [],
            [
               { text: "If both of a samples DNA match both of another samples, it's likely that those samples are part of the same strain." }
            ]
         ],

         [
            [],
            [
               { text: "The top quadrant is the matches of one DNA piece." },
               { text: "The bottom quandrant is the matches in the second DNA piece." }
            ]
         ],

         [
            [],
            [
               { text: "The goal is to create the largest square of matching DNA fingerprints." },
               { text: "The square must begin at the highlighted diagonal." }
            ]
         ],

         [
            [],
            [
               { text: "The score corresponds to how large the square is." }
            ]
         ],

         [
            [],
            [
               { text: "To make a bigger square, you can drag and reorganize the rows and columns, but there is one rule." },
               { text: "The rows and columns must be kept in the same order. This means all reordering will be done along the diagonal." }
            ]
         ]
      ];


      var svg = d3.select('tutorial')
         .append('svg')
         .style('position', 'relative')
         .attr('width', width)
         .attr('height', height)
      ;

      var g = svg.append('svg:g');

      d3.select('#prev') 
         .on('click', function() { return step == 0 ? null : prevStep() })
      ;

      d3.select('#next')
      .on('click', function() { return step == steps.length-1 ? null : nextStep() })
      ;

      nextStep();

      function nextStep() {


         step++;

         direction = 1;

         update_seekers();
         update(steps[step]);

      }

      function prevStep() {

         step--;

         direction = -1;

         update_seekers();
         update(steps[step]);

      }

      function update_seekers() {

         d3.select('#prev') 
            .on('click', function() { return step == 0 ? null : prevStep() })
            .attr('class', function() { return step == 0 ? "disabled btn" : "btn" })
         ;

         d3.select('#next') 
            .on('click', function() { return step == steps.length-1 ? null : nextStep() })
            .attr('class', function() { return step == steps.length-1 ? "disabled btn" : "btn" })
         ;

      }

      function update(data) {

         clearInterval(currentInterval);

         var r = g.selectAll('rect')
            .data(data[0], function(d) { return d.id; })
         ;

         var text = g.selectAll('text')
            .data(data[1], function(d) { return d.text; })
         ;

         r
            .transition()
            .duration(200)
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('width', function(d) {  return d.width; })
            .attr('height', function(d) { return d.height; })
            .style('fill', function(d) { return d.fill; })
         ;

         r.enter()
            .append('rect')
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; })
            .style('fill', function(d) { return d.fill; })
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1)
         ;

         r.exit()
            .remove();

         /*text
            .attr('y', function(d, i) { return 300 + ((2 - text.size() + i) * 30) + (direction * 10); }) 
            .style('opacity', 0)
            .attr('x', 0) 
            .transition()
            .duration(200)
            .text(function(d) { return d.text })
            .attr('y', function(d, i) { return 300 + (2 - text.size() + i) * 30; }) 
            .style('opacity', 1)
         ;
         */

         text.enter()
            .append('text')
            .text(function(d) { return d.text })
            .attr('y', function(d, i) { return height - ((text.size() - i) * 30) + (direction * 10); }) 
            .attr('x', 0) 
            .style('opacity', 0)
            .transition()
            .duration(200)
            .ease("out")
            .attr('y', function(d, i) { return height - (text.size() - i) * 30; }) 
            .style('opacity', 1)
         ;

         text.exit()
            .remove();

         
         if(step ==  2) {
            
            currentInterval = setTimeout(function() {
                  console.log('transition');

                  data[0][0].fill = (data[0][0].fill == "#abc" ? "#ccc" : "#abc");

                  update(steps[2]);

            }, 1000);

         } else if(step ==  3) {
            
            currentInterval = setTimeout(function() {
                  console.log('transition');

                  data[0][1].x = (data[0][1].x == "600px" ? "100px" : "600px");
                  data[0][2].x = (data[0][2].x == "300px" ? "500px" : "300px");
                  data[0][3].x = (data[0][3].x == "100px" ? "600px" : "100px");

                  update(steps[3]);

            }, 1000);
         }

      }

   }
}
})
