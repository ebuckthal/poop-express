var mysql = require('mysql'),
    bcrypt = require('bcrypt');

var pool = mysql.createPool({
   host: 'localhost',
   user: 'eric', 
   password: 'secret',
   database: 'pooptest',
   connectionLimit: 10,
   supportBigNumbers: true
});

exports.insertUser = function(email, password, callback) {

   bcrypt.genSalt(10, function(err, salt) {

      if (err) {
         console.log('BCRYPT ERROR');
         console.log(err);
         return callback(err, null);
      }

      bcrypt.hash(password, salt, function (err, hash) {

         if (err) {
            console.log('BCRYPT ERROR');
            console.log(err);
            return callback(err, null);
         }

         pool.getConnection(function (err, con) {

            if (err) {
               console.log('MYSQL connection error');
               console.log(err);
               return callback(err, null);
            }

            con.query( 'INSERT INTO users (EMAIL, HASHED_PASSWORD) VALUES ( ?, ? )' , [email, hash], 
               function( err, results ) {

                  con.release();

                  if (err) {
                     console.log('MYSQL QUERY ERROR');
                     console.log(err);
                     return callback(err, null);
                  }

                  console.log('MYSQL INSERT SUCCESSS');
                  console.log(results[0]);


                  return callback(null, results[0]);
            });
         });
      });
   });

};

exports.findUserById = function(id, callback) {

   pool.getConnection( function (err, con) {

      if (err) {
         console.log('MYSQL connection error');
         console.log(err);
         return callback(err, null);
      }

      con.query( 'SELECT * FROM users WHERE ID = ?', [id],
         function( err, results ) {
            con.release();

            if (err) {
               console.log('MYSQL QUERY ERROR');
               console.log(err);
               return callback(err, null);
            }


            console.log('MYSQL SELECT SUCCESS');
            console.log(results[0]);

            return callback(null, results[0]);
         });
   });

};

exports.findUserByEmail = function (email, callback) {

   pool.getConnection( function (err, con) {

      if (err) {
         console.log('MYSQL CONNECTION ERROR');
         console.log(err);
         return callback(err, null);
      }

      con.query( 'SELECT * FROM users WHERE EMAIL = ?', [email],
         function( err, results ) {

            con.release();

            if (err) {
               console.log('MYSQL QUERY ERROR');
               console.log(err);
               return callback(err, null);
            }

            console.log('MYSQL SELECT SUCCESS');
            console.log(results[0]);
            return callback(null, results[0]);
         });
   });
};

exports.getPuzzleById = function (id, callback) {

   pool.getConnection( function (err, con) {

      if (err) {
         console.log('MYSQL CONNECTION ERROR');
         console.log(err);
         return callback(err, null);
      }

      con.query( 'SELECT * FROM puzzles WHERE ID = ?', [id],
         function( err, results ) {

            con.release();

            if (err) {
               console.log('MYSQL QUERY ERROR');
               console.log(err);
               return callback(err, null);
            }

            console.log('MYSQL SELECT SUCCESS');
            console.log(results[0]);
            return callback(null, results[0]);
         });
   });
};

exports.getPuzzles = function (callback) {

   pool.getConnection(function (err, con) {

      con.query('SELECT id, description FROM puzzles',
         function(err, results) {

            con.release();

            if (err) {
               console.log('MYSQL QUERY ERROR');
               console.log(err);

               return callback(err, null);
            }

            console.log('MYSQL SELECT SUCCESS');
            console.log(results);
            return callback(null, results);

         });
   });
};
