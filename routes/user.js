var db = require('../database.js');

exports.login = function (req, res) {
   res.send(req.user, 200);
};

exports.logout = function (req, res) {
   req.logout();
   res.send(req.user, 200);
};

exports.register = function (req, res) {
   db.insertUser(req.body.email, req.body.password, function( err, data ) {

      if(err) {
         res.send(err, 500);
      } else {
         res.send(req.body, 200);
      }
   });
};


