var POOPSLIDE = (function() {

   var slides = [];
   var svg = null;

   var currentIndex = null;
   var previousIndex = null;

   function init(options) {

      svg = d3.select(options.idSVG);
      currentIndex = -1;
      slides = [];
   }

   function addSlide(options) {
      slides.push(newSlide(options));
   }

   d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
         this.parentNode.appendChild(this);
      });
   };

   function newSlide(options) {

      var data = options.data;
      var onEnter = options.onEnter;
      var onRemove = options.onRemove;

      function drawRect(rect) {
         var r = svg.selectAll('.box')
            .data(rect, function(d) { return d.id; })
         ;

         r.enter()
            .append('rect')
            .attr('class', 'box')
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; })
         
         ;

         r.exit()
            .remove();

      }

      function drawGame(gamedata) {

         var game = svg.selectAll('.game')
            .data(gamedata, function(d) { return d.id })
         ;

         game
            .transition()
            .duration(100)
            .attr('width', function(d) { return d.gameSize; })
            .attr('height', function(d) { return d.gameSize; })
            .attr('transform', function(d) {
               return 'translate(' + d.x + ',' + d.y + ')';
            })
            .transition()
            .duration(100)
            .attr('transform', function(d) {
               return 'translate(' + d.x + ',' + (d.y+25) + ')scale(1,0.95)';
            })
            .transition()
            .duration(100)
            .attr('transform', function(d) {
               return 'translate(' + d.x + ',' + d.y + ')scale(1,1)';
            })
            .each("end", function(){ if(onEnter !== undefined) { onEnter(data); } })
            //game.call(onSlideChange);
         ;


         game.enter()
            .append('svg:g')
            .attr('class', 'game')
            .attr('width', function(d) { return d.gameSize; })
            .attr('height', function(d) { return d.gameSize; })
            .attr('transform', function(d) {
               return 'translate(' + d.x + ',' + d.y + ')';
            })
            .call(POOPSNOOP.newGame)
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1)
         ;


         game.exit()
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove()
         ;

      }

      function drawText(text) {

         var t = svg.selectAll('.text-slide')
            .data(text, function(d) { return d.id; })
            //transform here
         ;

         t
            .html(function(d) { return '<span class="text-box" id="' + d.id + '">' + d.text + '</span>'})
            .transition()
            .duration(200)
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }) 
         ;

         //enter
         t.enter()
            .append('foreignObject')
            .attr('class', 'text-slide')
            .html(function(d) { return '<span class="text-box" id="' + d.id + '">' + d.text + '</span>'})
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }) 
            .attr('width', 600)
            .attr('height', 600)
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1)
         ;

         //update and enter

         t 
            .exit()
            .style('opacity', 1)
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove();

      }

      function enter() {
         
         var previousSlide = slides[previousIndex];


         if(previousSlide !== undefined &&
            previousSlide.onRemove !== undefined) {
            previousSlide.onRemove(data);
         }


         if(data.game !== undefined) {
            drawGame(data.game);
         }

         if(data.rect !== undefined) {
            drawRect(data.rect);
         }

         if(data.text !== undefined) {

            drawText(data.text);
         }

         if(onEnter !== undefined) {
            //onEnter(data);
         }

         

      };

      return {
         enter: enter,
         onRemove : onRemove,
         onEnter : onEnter
      };
   };

   function nextSlide() {

      previousIndex = currentIndex;
      currentIndex = Math.min(slides.length-1, currentIndex+1);
      goToSlide(currentIndex);
   }

   function prevSlide() {
         
      previousIndex = currentIndex;
      currentIndex = Math.max(0, currentIndex-1);
      goToSlide(currentIndex);
   }

   function goToSlide(index) {

      if(index > slides.length || index < 0) {
         console.log('illegal operation');
         return;
      }

      slides[index].enter();

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
