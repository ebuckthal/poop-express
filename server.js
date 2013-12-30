var express = require('express'),
    api = require('./routes/api'),
    user = require('./routes/user'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./database'),
    bcrypt = require('bcrypt');

// PASSPORT SETUP

passport.serializeUser( function (user, done) {
   console.log('serializing: ' + user.id);
   console.log(user);
   done(null, user.id);
});

passport.deserializeUser( function (id, done) {
   db.findUserById(id, function (err, user) {
      if (err) done(err, null);
      else done(null, user);
   });
});

passport.use(
   new LocalStrategy( {
      usernameField: 'email'
   },
   function (email, password, done) {

      db.findUserByEmail( email, function (err, user) {

         if (err) { return done(err); }

         if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
         }

         bcrypt.compare(password, user.hashed_password, function(err, res) {

            if (!res) {
               return done(null, false, { message: 'Incorrect password.' });
            }
            
            return done(null, user);

         });
      });
   }
));

var app = module.exports = express();

// EXPRESS GOODIES

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);



// ROUTING 


//app.get('/user', user.get);
app.post('/user/login', passport.authenticate('local'), user.login);
app.get('/user/logout', user.logout);
app.post('/user/register', user.register);

app.get('/api/puzzle/:puzzle', api.puzzle);
app.get('/api/puzzle', api.puzzles);

app.get('/partials/:name', routes.partial);
app.get('/', routes.index);


// CREATE SERVER

app.listen(app.get('port'), function () {
   
   console.log('Express server listening on port ' + app.get('port'));
});


function ensureAuthenticated (req, res, next) {
   console.log(req.isAuthenticated());
   if(req.isAuthenticated()) { 
      return next();
   }

   res.send(401);
}
