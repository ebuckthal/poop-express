angular.module('POOPSLIDE', [])

.service('POOPSLIDE', function() {

   var slides = [[]];
   var toExecute = [];

   var indexSlide = 0;
   var indexInner = 0;

   var currentSlide;
   
   function Slide(onEnter, onRemove) {

      this.onEnter = onEnter;
      this.onRemove = onRemove;
   }

   function isNextSlide() {
      return indexSlide < slides.length-1;
   }

   function isInnerSlide() {
      return indexInner < slides[indexSlide].length-1;
   }

   function isPrevInnerSlide() {
      return indexInner > 0; //slides[indexSlide].length-1;

   }

   function isPrevSlide() {
      return indexSlide > 1;
   }

   function addSlide(onE, onR) {
      slides.push([new Slide(onE, onR)]);
   };

   function addInnerSlide(onE, onR) {
      slides[slides.length-1].push(new Slide(onE, onR));
   }

   function getNextSlide() {
      return slides[++indexSlide][indexInner = 0];
   }

   function getNextInnerSlide() {
      return slides[indexSlide][++indexInner];
   }

   function getCurrentBaseSlide() {
      return slides[indexSlide][indexInner = 0];

   }

   function getPrevSlide() {
      return slides[--indexSlide][indexInner = 0];
   }

   function execNextSlide() {

      if (isInnerSlide()) {

         currentSlide = getNextInnerSlide();
         toExecute.push(currentSlide.onRemove);
         currentSlide.onEnter();


      } else if (isNextSlide()) {

         var f;
         while (f = toExecute.pop()) {
            f();
         }

         currentSlide = getNextSlide();
         toExecute.push(currentSlide.onRemove);
         currentSlide.onEnter();
      }

   }

   function execPrevSlide() {

      if (isPrevInnerSlide()) {

         var f;
         while (f = toExecute.pop()) {
            f();
         }

         currentSlide = getCurrentBaseSlide();
         toExecute.push(currentSlide.onRemove);
         currentSlide.onEnter();

      } else if(isPrevSlide()) {

         var f;
         while (f = toExecute.pop()) {
            f();
         }

         currentSlide = getPrevSlide();
         toExecute.push(currentSlide.onRemove);
         currentSlide.onEnter();

      }

   }


   function drawText(selection, text, delay) {

      delay = (delay === undefined ? 0 : delay);

      if(text.text !== undefined){
         this.style('opacity', 1);
      }

      //console.log(text);
      var t = this.selectAll('.text-slide')
         .data([text], function(d) { return d.text; })
      ;

      /*t
         .style('opacity', 0)
         .html(function(d) { return d.text; })
         .transition()
         .duration(200)
         .style('opacity', 1)
         .style('padding-left', 0)
      ;
      */

      //enter
      t.enter()
         .append('div')
         .attr('class', 'text-slide')
         .style('opacity', 0)
         .transition()
         .delay(delay)
         .duration(200)
         .style('opacity', 1)
      ;

      //update and enter
      t
         .html(function(d) { return d.text; })
      ;

      t 
         .exit()
         .remove();

      if(text.text == undefined){
         this.style('opacity', 0);
      }


      return t;
   }

   return {
      addSlide: addSlide,
      addInnerSlide: addInnerSlide,
      gotoNextSlide: execNextSlide,
      gotoPrevSlide: execPrevSlide,
      drawText: drawText
   }

});
