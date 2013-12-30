var db = require('../database.js'),
    csv = require('csv');


exports.puzzles = function(req, res) {

   db.getPuzzles(function (err, puzzles) {

      if (err) {
         res.send(400, req.body);
      } else {
         res.send(200, puzzles);
      }
      
   });
   //res.send( { username: req.user } );
};

exports.puzzle = function(req, res) {

   db.getPuzzleById(req.params.puzzle, function(err, puzzle) {

      if(err) {
         res.send(400, req.body);
      } else {

         csv().from.string(puzzle.puzzle)
            .to.array( function(p) {

               /*for(var i = 0; i < p.length; i++) {

                  for(var j = 0; j < p[i].length; j++) {

                     
                     if(p[i][j] != '') {
                        p[i][j] = parseFloat(p[i][j]);
                     }

                  }
               }*/


               console.log(p);

               res.send(200, p);
            });
      }
   });

};
