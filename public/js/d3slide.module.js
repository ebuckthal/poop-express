var POOPSLIDE = (function() {

   var slides = [];
   var svg = null;

   var currentIndex = null;
   var previousIndex = null;

   var onSlideChange = undefined; 

   function init(options) {

      svg = d3.select(options.idSVG);
      currentIndex = -1;
      slides = [];
      onSlideChange = options.onSlideChange;
   }

   function addSlide(options) {
      slides.push(newSlide(options));
   }

   function newSlide(options) {

      var data = options.data;
      var onEnter = options.onEnter;
      var onRemove = options.onRemove;

      function drawRect(rect) {
         var r = svg.selectAll('rect')
            .data(rect, function(d) { return d.id; })
         ;

         r.enter()
            .append('rect')
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; })
         
         ;

         r.exit()
            .remove();

      }

      function drawText(text) {

         var t = svg.selectAll('.text-slide')
            .data(text, function(d) { return d.id; })
            //transform here
         ;

         //update

         //enter
         t.enter()
            .append('foreignObject')
            .attr('class', 'text-slide')
            .attr('width', 150)
            .attr('height', 100)
         ;

         t
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }) 
            .html(function(d) { return '<div class="text-box">' + d.text + '</div>'})
         ;

         t 
            .exit()
            .style('opacity', 1)
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();


         /*
           t.append('foreignObject')
               .attr('x', 100)
               .attr('y', 300)
               .attr('width', 150)
               .attr('height', 100)
               .append('xhtml:body')
               .html(function(d) { return '<div class="text">' + d.text + '</div>'})
         ;

         svg.selectAll('.text-slide')
            .data(text, function(d) { return d.id; })
            .exit()
            .remove()
         ;
         */



         /*
         t.enter()
            .attr('class', 'text-slide')
            .attr('x', function(d) { return "100px"; })
            .attr('y', function(d) { return "100px"; })
            .text(function(d) { return d.text; })
            .style('opacity', 0)
            .transition()
            .duration(100)
            .style('opacity', 1)
         ;

         t.text(function(d) { return d.text; })
            .style('opacity', 0)
            .transition()
            .duration(100)
            .style('opacity', 1)
         ;
         */
      }

      function enter() {
         
         var previousSlide = slides[previousIndex];

         //console.log(previousSlide);

         if(previousSlide !== undefined &&
            previousSlide.onRemove !== undefined) {
            previousSlide.onRemove(data);
         }

         if(data.rect !== undefined) {
            drawRect(data.rect);
         }

         if(data.text !== undefined) {
            drawText(data.text);
         }

         if(onEnter !== undefined) {
            onEnter(data);
         }
      }

      return {
         enter: enter,
         onRemove : onRemove,
         onEnter : onEnter
      };
   };

   function nextSlide() {

      previousIndex = currentIndex;
      currentIndex = Math.min(slides.length-1, currentIndex+1);
      return goToSlide(currentIndex);
   }

   function prevSlide() {
         
      previousIndex = currentIndex;
      currentIndex = Math.max(0, currentIndex-1);
      return goToSlide(currentIndex);
   }

   function goToSlide(index) {

      if(index > slides.length || index < 0) {
         console.log('illegal operation');
         return;
      }

      slides[index].enter();

      onSlideChange(slides, currentIndex);
   }

   function canPrev() {
      return currentIndex <= 0 ? false : true;
   }

   function canNext() {
      return currentIndex >= slides.length - 1 ? false : true;
   }

   function getCurrentIndex() {
      return currentIndex;
   }
   
   function getLength() {
      return slides.length;
   }

   return {
      init : init,
      addSlide: addSlide,
      goToSlide: goToSlide,
      nextSlide: nextSlide,
      prevSlide: prevSlide,
      getCurrentIndex: getCurrentIndex,
      getLength: getLength,
      canNext: canNext,
      canPrev: canPrev
   };

})();
