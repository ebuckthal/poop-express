angular.module('d3tutorial', []).directive('tutorial', function() {

return {

   restrict: "E",
   link: function(scope, element, attrs) {

      var height = 600;
      var width = 800;

      var step = -1;
      var direction;

      var steps = [

         [
            [],
            [ { text: 'POOPGAME is a puzzle game about identifying strains of E. coli.' } ]
         ],

         [
            [ /*{ id: 'r1', width: '10%', height: '10%' }*/ ],
            [ { text: 'Certain strains for E. coli are a major cause of foodborne bacterial diseases.', x: 45 } ]
         ],

         [
            [ /*{ id: 'r1', width: '20%', height: '20%' }*/ ],
            [ 
               { text: 'In order to monitor populations of E. coli, Cal Poly has created a database of E. coli samples.' }, 
               { text: 'The database contains important information about the strains including location, date, and genetic data.' }
            ]
         ],

         [
            [],
            [ 
               { text: "The purpose of Poop Snoop is to group the samples of E. coli into strains." },
               { text: "Researchers like to know when dangerous strains might be infecting bodies of water or crops." }
            ]
         ],


         [
            [],
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


         var r = g.selectAll('rect')
            .data(data[0], function(d) { return d.id; })
         ;

         var text = g.selectAll('text')
            .data(data[1], function(d) { return d.text; })
         ;

         r
            .transition()
            .duration(200)
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; })
         ;

         r.enter()
            .append('rect')
            .transition()
            .duration(200)
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; })
         ;

         r.exit()
            .remove();

         text
            .attr('y', function(d, i) { return 300 + ((2 - text.size() + i) * 30) + (direction * 30); }) 
            .style('opacity', 0)
            .attr('x', 0) 
            .transition()
            .duration(200)
            .text(function(d) { return d.text })
            .attr('y', function(d, i) { return 300 + (2 - text.size() + i) * 30; }) 
            .style('opacity', 1)
         ;

         text.enter()
            .append('text')
            .text(function(d) { return d.text })
            .attr('y', function(d, i) { return height - ((text.size() - i) * 30) + (direction * 30); }) 
            .attr('x', 0) 
            .style('opacity', 0)
            .transition()
            .duration(200)
            .ease("in-out")
            .attr('y', function(d, i) { return height - (text.size() - i) * 30; }) 
            .style('opacity', 1)
         ;

         text.exit()
            .remove();

      }

   }
}
})
