// Make an instance of two and place it on the page.
var elem = document.querySelector('body');
var params = { width: 500, height: 500 };
var two = new Two(params).appendTo(elem);

var buffers = [];

function Box(row, col, width) {

   this.width = width;
   this.row = row;
   this.col = col;
   
   this.animating = false;

   this.shape;

   this.init();
}

Box.prototype.generate = function(radius, amount) {

   return _.map(_.range(amount), function(i) {
      var pct = i / amount;
      var angle = (pct * Math.PI * 2);
      var x = radius * Math.cos(angle);
      var y = radius * Math.sin(angle);
      var anchor = new Two.Anchor(x, y);
      anchor.origin = new Two.Vector().copy(anchor);
      //vertices++;
      return anchor;
   });
}

Box.prototype.init = function() {

   this.points = this.generate(this.width, 4);
   //this.shape = two.makeRectangle(this.x, this.y, this.width, this.width);
   this.shape = new Two.Polygon(this.points, true);

   this.shape.fill = 'rgba(' + (this.row*30) + ',' + (this.col*30) + ', 255, 0.75)';

   this.shape.rotation = Math.PI / 4;

   two.update();

   //console.log(this.shape);

   //this.shape._renderer.elem.row = this.row;
   //this.shape._renderer.elem.col = this.col;

   //this.enableEvents();

}

Box.prototype.enableEvents = function() {

   $(this.shape._renderer.elem)
      .on('mousedown', function(e) {
         grid.select(this.row, this.row);
      });

   $(this.shape._renderer.elem)
      .on('mouseenter', function(e) {
         //console.log('mouseenter ' + this.row + ' ' + this.col);
         grid.highlight(this.row, this.row);
      });

   $(this.shape._renderer.elem)
      .on('mouseleave', function(e) {
         //console.log('mouseleave ' +  this.row + ' ' + this.col);
         grid.unhighlight(this.row, this.row);
      });

}

Box.prototype.disableEvents = function() {

   console.log('disabling');

   $(this.shape._renderer.elem)
      .unbind();
}

function Grid(numRows, numCols, width, orientation) {

   this.attributes = { numRows: numRows, numCols: numCols, width: width };
   this.selected = { row: -1, active: false };
   this.highlighted = { row: -1, active: false };
   this.orientation = orientation;

   this.vectors = [];
   this.boxes = []
   this.group = two.makeGroup();

   this.init();
}

Grid.prototype.getBoxesFromIndex = function(index) {
   return _.filter(_.flatten(this.boxes), function(b) {
      return b.row == this.orientation[index] || b.col == this.orientation[index]; 
   }, this);
}

Grid.prototype.getBoxesFromRow = function(row) {
   return _.filter(_.flatten(this.boxes), function(b) {
      return b.row == row || b.col == row;
   });
}

Grid.prototype.getBoxesMinusRow = function(row) {
   return _.reject(_.flatten(this.boxes), function(b) {
      return b.row == row || b.col == row;
   });
}

Grid.prototype.init = function() {

   for(col = 0; col < this.attributes.numCols; col++) {

      this.boxes.push([]);

      for(row = 0; row < this.attributes.numRows; row++) {

         var x = this.orientation.indexOf(col) * (this.attributes.width / (this.attributes.numCols));
         var y = this.orientation.indexOf(row) * (this.attributes.width / (this.attributes.numRows));

         var box = new Box(row, col, (this.attributes.width / this.attributes.numRows)*0.5);

         box.shape.translation.set(x,y);

         this.boxes[col].push(box);

         this.group.add(box.shape);
      }
   }

   this.group.center();
   this.group.translation.set(two.width/2, two.width/2);

   this.initVectors();
}

Grid.prototype.initVectors = function() {

   _.each(_.flatten(this.boxes), function(b) {
      if(b.row == b.col) {
         this.vectors.push(b.shape.translation.clone());
      }
   }, this);

   this.vectors = _.sortBy(this.vectors, function(v) {
      return v.x;
   });

}

Grid.prototype.getVectorFromIndex = function(index) {
   if(index < 0 || index > this.vectors.length-1) {
      return null;
   } else {
      return this.vectors[index].clone();
   }
}

Grid.prototype.updateSelected = function() {

   this.selected.index = this.orientation.indexOf(this.selected.row);

   playPling(this.selected.plingCount++);

   Animation.redrawBoxes(this.getBoxesMinusRow(this.selected.row));
}

Grid.prototype.select = function(row) {

   this.selected.active = true;
   this.selected.vector = {};

   this.selected.row = row;
   this.selected.boxes = this.getBoxesFromRow(this.selected.row);
   this.selected.box = this.boxes[this.selected.row][this.selected.row];
   this.selected.plingCount = 0;

   this.updateSelected();
}

Grid.prototype.selectMouse = function(mouse) {

   if(!this.isMouseInGrid(mouse)) {
      return;
   }

   mouse.subSelf(this.group.translation);

   this.select(this.orientation[this.getNearestIndexToVector(mouse)]);

}

Grid.prototype.isMouseInGrid = function(mouse) {

   var b = this.group.getBoundingClientRect();

   return (mouse.x > b.left && mouse.x < b.right && mouse.y > b.top && mouse.y < b.bottom);
}

Grid.prototype.highlightMouse = function(mouse) {

   if(!this.isMouseInGrid(mouse)) {
      return;
   }

   mouse.subSelf(this.group.translation);

   this.highlight(this.orientation[this.getNearestIndexToVector(mouse)]);

}

Grid.prototype.highlight = function(row) {
   this.highlighted.active = true;
   this.highlighted.row = row;

   this.highlighted.boxes = this.getBoxesFromRow(this.highlighted.row);
   this.highlighted.box = this.boxes[this.highlighted.row][this.highlighted.row];

   //console.log(this.highlighted.box);

   this.highlighted.box.shape.stroke = "orangered";
   this.highlighted.box.shape.linewidth = 15;

   this.highlighted.animation = Animation.wiggleOnce;

   //Animation.highlight(this.highlighted.boxes);
}

Grid.prototype.unhighlight = function() {

   Animation.wiggleEnd();

   if(this.highlighted.box != null) {
      this.highlighted.box.shape.stroke = "#000";
      this.highlighted.box.shape.linewidth = 1; 
   }

   this.highlighted.active = false;
   this.highlighted.animation = null;
   this.highlighted.boxes = null;
}

Grid.prototype.deselect = function() {

   if(!this.selected.active) {
      return;
   }

   playCheer();

   this.selected.active = false;
   this.selected.index = -1;
   this.selected.boxes = null;
   this.selected.vector = null;


   Animation.redrawBoxes(this.getBoxesFromRow(this.selected.row));

   Animation.dropBoxes(this.getBoxesMinusRow(this.selected.row));

}

Grid.prototype.swapOrientation = function(indexToSwap) {

   var tmp = this.orientation[this.selected.index];
   this.orientation[this.selected.index] = this.orientation[indexToSwap];
   this.orientation[indexToSwap] = tmp;

   this.updateSelected();
}

//return closest index from mouse position (THIS WE CAN DO IN CANVAS!!!)
Grid.prototype.getNearestIndexToVector = function(mouse) {

   var r = _.map(this.vectors, function(v) { return v.distanceToSquared(mouse); });

   var min = _.min(r);

   var i = r
    .indexOf(min);

   return i;
}

Grid.prototype.getDistanceToIndex = function(index, vector) {

   if(index < 0 || index > this.orientation.length-1) {
      return Number.MAX_VALUE;
   }

   return vector.distanceToSquared(this.vectors[index]);
}

Grid.prototype.handleDrag = function(mouse) {

   if(!this.selected.active) {
      return;
   }

   //put mouse in Grid's matrix
   mouse.subSelf(this.group.translation);

   Animation.drawAtMouse(mouse);

   var mouseToSel = this.getDistanceToIndex(this.selected.index, mouse); 
   var mouseToPrev = this.getDistanceToIndex(this.selected.index-1, mouse); 
   var mouseToNext = this.getDistanceToIndex(this.selected.index+1, mouse); 

   if(mouseToPrev < mouseToSel) {
      this.swapOrientation(this.selected.index-1);
   } else if (mouseToNext < mouseToSel) {
      this.swapOrientation(this.selected.index+1);
   }
}

var drag = 0.1;

var grid = new Grid(5, 5, 400, [3,2,1,4,0]);

var delta = new Two.Vector();
var mouse = new Two.Vector();

var Animation = {

   randomTiles: function(boxes) {

      _.each(boxes, function(b) {

         var start = b.shape.translation.y;

         var offset = Math.random() * 100;

         var t0 = new TWEEN.Tween({ x: start })
            .to({ x: start-100 }, 300)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
               b.shape.translation.y = this.x;
            })

         var t1 = new TWEEN.Tween({ x: start-100 })
            .to({ x: start }, 300)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
               b.shape.translation.y = this.x;
            })

         t0.chain(t1);
         t0.start();

      });
   },

   highlight: function(boxes) {

      _.each(boxes, function(b) {
         b.shape.fill = 'rgba(' + (b.row*30) + ',' + (b.col*30) + ', 255, 0.5)';
      });

   },

   unhighlight: function(boxes) {

      _.each(boxes, function(b) {
         b.shape.fill = 'rgba(' + (b.row*30) + ',' + (b.col*30) + ', 255, 0.9)';
      });

   },

   drawAtMouse: function(vector) {

      _.each(_.flatten(grid.selected.boxes), function(b) {

         var vC = this.orientation.indexOf(b.col);
         var vR = this.orientation.indexOf(b.row);

         if(b.row == this.selected.row) {
            b.shape.translation.y = vector.y;
         } else {
            b.shape.translation.y = this.vectors[vR].y;
         }

         if(b.col == this.selected.row) {
            b.shape.translation.x = vector.x;
         } else {
            b.shape.translation.x = this.vectors[vC].x;
         }

      }, grid); 

   },

   redrawBoxes: function(boxes) {

      _.each(_.flatten(boxes), function(b) {


         var vC = this.orientation.indexOf(b.col);
         var vR = this.orientation.indexOf(b.row);

         b.shape.translation.set(this.vectors[vC].x, this.vectors[vR].y);

      }, grid);

   },

   wiggleOnce: function() {

      _.each(grid.highlighted.boxes, function(b) {
         _.each(b.shape.vertices, function(anchor) {

            anchor.x = anchor.origin.x + Math.random() * 3 - 2;
            anchor.y = anchor.origin.y + Math.random() * 3 - 2;
         });

      }, grid)
   },

   wiggleEnd: function() {

      _.each(grid.highlighted.boxes, function(b) {
         _.each(b.shape.vertices, function(anchor) {

            anchor.x = anchor.origin.x;
            anchor.y = anchor.origin.y;
         })
      }, grid)

   },

   spinBoxes: function(boxes) {
      _.each(boxes, function(b) {
         if(b.animating) { return; }
      })

   },

   dropBoxes: function(boxes) {

      _.each(boxes, function(b) {

         if(b.animating) { return; }

         b.animating = true;

         var start = {
            translation: b.shape.translation.y,
            rotation: b.shape.rotation
         };

         var delay = (Math.random()*100)+200;
         var translation = 200;
         var rotation = (Math.random() * 2) - 1;
         var scale = (Math.random() * 0.5) + 0.5;

         var t0 = new TWEEN.Tween(
               { 
                  x: start.translation, 
                  o: 1, 
                  r: start.rotation,
                  s: 1, 
               })
            .to(
               { 
                  x: translation, 
                  o: 0, 
                  r: rotation,
                  s: 0.5 
               }, 
               300)

            .delay(delay)
            .easing(TWEEN.Easing.Cubic.In)
            .onUpdate(function() {
               b.shape.translation.y = this.x;
               b.shape.opacity = this.o;
               b.shape.rotation = this.r;
               b.shape.scale = this.s;
            })

         var t1 = new TWEEN.Tween(
               { 
                  x: start.translation-200, 
                  o: 1, 
                  r: rotation,
                  s: 0.5
               })
            .to(
               { 
                  x: start.translation, 
                  o: 1, 
                  r: start.rotation,
                  s: 1
               }, 
               600)

            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function() {
               b.shape.translation.y = this.x;
               b.shape.opacity = this.o;
               b.shape.rotation = this.r;
               b.shape.scale = this.s;
            })
            .onComplete(function() {
               b.animating = false;
            })

         t0.chain(t1);
         t0.start();

      });
   }
}

var delta = new Two.Vector();
var mouse = new Two.Vector();

two.bind('update', function(frameCount) {
   TWEEN.update();

   if(grid.highlighted.animation) {
      grid.highlighted.animation();
   }
}).play();

$(document).on('ready', function() {

   bufferLoader = new BufferLoader(
      context,
         [
            'super-sfx/ball-paddle.mp3',
            'super-sfx/pling1.mp3',
            'super-sfx/pling2.mp3',
            'super-sfx/pling3.mp3',
            'super-sfx/pling4.mp3',
            'super-sfx/pling5.mp3',
            'super-sfx/pling6.mp3',
            'super-sfx/pling7.mp3',
            'super-sfx/pling8.mp3',
            'super-sfx/pling9.mp3',
            'super-sfx/pling10.mp3'
         ],
      finishedLoading
      );

   bufferLoader.load();

});

function finishedLoading(bufferlist) {

   _.each(bufferlist, function(b, i) {
      buffers[i] = b;
   });

}

function playCheer() {
   var source = context.createBufferSource();

   source.connect(context.destination);

   source.buffer = buffers[0];

   source.start(0);
}

function playPling(i) {
   var source = context.createBufferSource();

   source.connect(context.destination);

   source.buffer = buffers[(i % 8) + 1];

   source.start(0);
}

$(window).on('mouseup', function(e) {
   grid.deselect();
});

var svg = $('svg').offset();

$(window)
.on('mousemove', function(e) {
   mouse.x = e.clientX - svg.left;
   mouse.y = e.clientY - svg.top;

   grid.handleDrag(mouse);

   if(!grid.selected.active) {
      grid.unhighlight();
      grid.highlightMouse(mouse);
   }
   //shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
   //shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
})
.on('mousedown', function(e) {
   mouse.x = e.clientX - svg.left;
   mouse.y = e.clientY - svg.top;

   grid.selectMouse(mouse);
});
