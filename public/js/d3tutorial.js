var height = 500;
var width = 700;

var step = 0;

var svg = d3.select('tutorial').append('svg')
   .style('position', 'absolute')
   .attr({ 'width': '100%', 'height': "100%" })
   .attr('viewBox', '0 0 ' + width + ' ' + height) 
;


svg.append('text')
   .attr('x', '45%')
   .attr('y', '50%')
   .style('cursor', 'pointer')
   .attr('fill', '#707070')
   .text('begin tutorial')
   .on('click', function() {
      nextStep();
   })
;


var steps = [
   function() {

      console.log('step 0');


      svg.append('svg:g')
         .attr('class', 'tutorial')
         .append('text')
         .attr('x', '45%')
         .attr('y', '25%')
         .attr('fill', '#000')
         .text('POOP SNOOP')
      ;


   },
   function() {

      console.log('step 1');

      svg
      .call(function () {
         svg.select('g')
            .transition()
            .attr('transform', 'translate(-1000,0)')
            .remove();
      })
      .call(function() {
         svg.append('svg:g')
            .attr('class', 'tutorial')
            .attr('transform', 'translate(1000, 0)')
            .attr({ 'width': '100%', 'height': "100%" })
            .append('text')
            .attr('x', '45%')
            .attr('y', '25%')
            .text('STEP 1')
      })
      ;

      
      svg.select('g')
         .transition()
         .attr('transform', 'translate(0,0)')
      ;

      /*
      svg.append('text')
         .attr('x', '10%')
         .attr('y', '50%')
         .style('cursor', 'pointer')
         .attr('fill', '#707070')
         .text('previous step')
         .on('click', function() {
            prevStep();
         })
      ;
      */

   },
   function() {

      console.log('step 2');

      svg.select('g')
         .transition()
         .attr('transform', 'translate(-1000,0)')
         .remove();

      svg.append('svg:g')
         .attr('class', 'tutorial2')
         .attr('transform', 'translate(1000, 0)')
         .attr({ 'width': '100%', 'height': "100%" })
         .append('text')
         .attr('x', '45%')
         .attr('y', '25%')
         .text('STEP 2')
      ; 

      svg.select('g')
         .transition()
         .attr('transform', 'translate(0,0)')
      ;

   }
   
];

function nextStep() {
   steps[++step]();
};

function prevStep() {
   steps[--step]();
};

steps[step](); 
