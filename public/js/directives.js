angular.module('directives', [])

.directive('snap', function() {
return {
   link : function(scope, element, attrs) {

      var color_b = "#DD0000";
      var color_b_highlight = "#FF0000";

      var color_t = "#55adab";
      var color_t_highlight = "#77CFCD";

      var color_diag = "#AAAAAA";
      var color_diag_highlight = "#DDDDDD";

      var color_neut = "#bada55";
      var color_neut_highlight = "#CBEB66";

      var cells = [];
      var last_x = 0;
      var start_x = 0;
      var sel = -1;

      var cell_width = Math.floor(600 / scope.puzzle.length);
      var draw_width = cell_width - 2;

      scope.s = Snap(element[0]);

      for(var i = 0; i < scope.puzzle.length; i++) {

         cells[i] = [];

         for(var j = 0; j < scope.puzzle.length; j++) {

            var x = drawHere(scope.currentSoln.orient.indexOf(i));
            var y = drawHere(scope.currentSoln.orient.indexOf(j));

            var f = getColor(i,j,false);

            cells[i][j] = scope.s
               .rect(x, 
                  y, 
                  draw_width, 
                  draw_width)
               .drag(
                  function(dx,dy,x,y) { //onmove
                     update(dx,dy,x,y);
                  },
                  function(x,y) { //onstart
                     grab(x,y);
                  },
                  function() { //onend
                     drop();
                  }
               )
               .attr( { fill: f } );

         }
      }

      calcScore();

      function boardToBiggestSquare(board_i,board_j) {

         //square length we are testing next
         outer:
         for(var k = 0; k < Math.min(scope.puzzle.length-board_i, scope.puzzle.length-board_j); k++) { 

            //if every square in a square starting from this space is a match, try one space larger
            //if we find something that doesn't match, break
            for(var i_s = board_i; i_s <= board_i + k; i_s++) {
               for(var j_s = board_j; j_s <= board_j + k; j_s++) {

                  if(!isMatch(scope.currentSoln.orient[i_s],scope.currentSoln.orient[j_s])) {
                     break outer;
                  }
               }
            }
         }
         
         return k;
      }

      function calcScore() {

         scope.currentSoln.score = 0;
         var big_i = 0;

         for(var board_i = 0; board_i < scope.puzzle.length; board_i++) {
            
               
            var b = boardToBiggestSquare(board_i, board_i);

               if(b > scope.currentSoln.score) {

                  //setColor(scope.currentSoln.orient[big_i], scope.currentSoln.orient[big_i], false);
                  //setColor(scope.currentSoln.orient[board_i],scope.currentSoln.orient[board_i],true);
                  scope.currentSoln.score = b;
                  big_i = board_i;

               } else {
                  //setColor(scope.currentSoln.orient[board_i],scope.currentSoln.orient[board_i],false);
               }

         }



         if(scope.currentSoln.score > scope.bestSoln.score) {
            scope.bestSoln.score = scope.currentSoln.score;
            scope.bestSoln.orient = scope.currentSoln.orient.slice(0);
         }
      }

      function getColor(r, c, h) {
         h = (typeof h === "undefined") ? false : h;

         var f;
         if(isMatch(r,c) && c > r) {

            f = h ? color_b_highlight : color_b;
         
         } else if(isMatch(r,c) && c < r) {

            f = h ? color_t_highlight : color_t;

         } else if(r == c) {

            f = h ? color_diag_highlight : color_diag;

         } else {
            f = h ? color_neut_highlight : color_neut;
         }
         return f;
      }

      function setColor(r, c, h) {
         h = (typeof h === "undefined") ? false : h;

         var f;
         if(isMatch(r,c) && c > r) {

            f = h ? color_b_highlight : color_b;
         
         } else if(isMatch(r,c) && c < r) {

            f = h ? color_t_highlight : color_t;

         } else if(r == c) {

            f = h ? color_diag_highlight : color_diag;

         } else {
            f = h ? color_neut_highlight : color_neut;
         }
         cells[r][c].attr({ fill : f });
      }

      function drawHere(index) {
         return index*cell_width+1;
      }

      function clickToIndex(x,y) {
         return Math.floor(Math.min(scope.puzzle.length-1, Math.max(0, (Math.max(x,y)/cell_width))));
      }

      function drawCol(c, t, x) {
         x = (typeof x === "undefined") ? drawHere(scope.currentSoln.orient.indexOf(c)) : x;
         t = (typeof t === "undefined") ? 0 : t;

         //console.log('draw col: ' + x);
         //c = Math.max(0, Math.min(c, length-1));

         for(var j = 0; j < scope.puzzle.length; j++) {
            cells[c][j].animate({
               x : x 
            }, t, mina.easein);
         }
      }

      function drawRow(r, t, y) {
         y = (typeof y === "undefined") ? drawHere(scope.currentSoln.orient.indexOf(r)) : y;
         t = (typeof t === "undefined") ? 0 : t;

         //r = Math.max(0, Math.min(r, length-1));
         
         //console.log('draw row: ' + y);
         for(var i = 0; i < scope.puzzle.length; i++) {
            cells[i][r].animate({
               y : y 
            }, t, mina.easein);
         }
      }

      function isMatch(r, c) {
         return (scope.puzzle[r][c] > 98 || r == c) ? true : false;
      }

      function boardToCell(c, r) {
         return cells[scope.currentSoln.orient[c]][scope.orient[r]];
      }

      function xToCol(x) {
         return Math.floor(Math.min(scope.puzzle.length, Math.max(0, (x-1)/cell_width)));
      }

      function yToRow(y) {
         return Math.floor(Math.min(scope.puzzle.length, Math.max(0, (y-1)/cell_width)));
      }

      function grab(mouse_x,mouse_y) {

         start_x = mouse_x - document.getElementsByTagName("svg")[0].offsetLeft;
         start_y = mouse_y - document.getElementsByTagName("svg")[0].offsetTop;

         last_x = start_x;
         last_y = start_y;

         sel = scope.currentSoln.orient[clickToIndex(start_x, start_y)];


         for(var i = 0; i < scope.puzzle.length; i++) {

            setColor(i, sel, true);
            setColor(sel, i, true);
         }

         //console.log('grabbing: ' + sel);
      }

      function drop() {
         //console.log('dropping: ' + sel);

         if(sel > -1) {

            for(var i = 0; i < scope.puzzle.length; i++) {

               setColor(i, sel, false);
               setColor(sel, i, false);
            }

            drawCol(sel);
            drawRow(sel);
         }
         sel = -1;

         scope.$apply(function () {

            calcScore();
         });

      }

      function update(dx, dy, mouse_x, mouse_y) {

         //set selected to my pos
         var x = start_x + dx;
         var y = start_y + dy;

         var cur_col = xToCol(x);
         var prev_col = xToCol(last_x);

         var cur_row = yToRow(y);
         var prev_row = yToRow(last_y);

         var cur_index = clickToIndex(x,y);
         var prev_index = clickToIndex(last_x, last_y);

         if(sel > -1 && cur_index != prev_index) {
            //console.log("swapping columns!");
            //console.log(scope.col_cur);

            var tmp = scope.currentSoln.orient[prev_index];
            scope.currentSoln.orient[prev_index] = scope.currentSoln.orient[cur_index]; 
            scope.currentSoln.orient[cur_index] = tmp;

            //redraw what we just were hovering over
            //drawCol(scope.col_cur[prev_col], 100);
            drawRow(scope.currentSoln.orient[prev_index], 200);
            drawCol(scope.currentSoln.orient[prev_index], 200);
            drawCol(sel);//, x-(cell_width/2-1));
            drawRow(sel);//y-(cell_width/2-1));
         }

         last_x = x;
         last_y = y;
      }
   }
}
});
