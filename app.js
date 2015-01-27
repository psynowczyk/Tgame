var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tgame');
var User = require('./models/user');
var Wallet = require('./models/wallet');
var Planet = require('./models/planet');
var Structure = require('./models/structure');
var Cost = require('./models/cost');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'asdsadasd',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes.js')(app, passport);

Cost.findOne({'id': 1}, function (err, result) {
	if (err) throw err;
	else if (!result) {
		var newCost = new Cost();
		newCost.save(function (err, cost) {
			if (err) throw err;
		});
	}
});

passport.serializeUser(function(user, done) {
   done(null, user.id);
});
passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
      done(err, user);
   });
});

passport.use('local-signup', new LocalStrategy({
	   usernameField : 'login',
	   passwordField : 'password',
	   passReqToCallback : true
	},
	function(req, login, password, done) {
		process.nextTick(function() {
			User.findOne({'local.login': login}, function(err, user) {
				if (err) return done(err);
				if (user) return done(null, false, {message: 'That login is already taken.'});
				else {
					User.findOne({'local.username': req.body.username}, function(err, user) {
						if (err) return done(err);
						if (user) return done(null, false, {message: 'That username is already taken.'});
						else {
							var newUser = new User();
							newUser.local.login = login;
							newUser.local.username = req.body.username;
							newUser.local.password = newUser.generateHash(password);
							newUser.save(function(err, record) {
								if (err) throw err;
								else {
									var newWallet = new Wallet();
									newWallet.owner = record._id;
									newWallet.save(function(err) {
										if (err) throw err;
										else {
											var newStructure = new Structure();
											newStructure.owner = record._id;
											newStructure.save(function(err) {
												if (err) throw err;
												else {
													var newPlanet = new Planet();
													newPlanet.owner = record._id;
													newPlanet.image = (Math.floor((Math.random() * 10) + 1)).toString();
													User.count(function(err, count) {
														if (err) throw err;
														else {
															Planet.findOne(function(err, neib) {
																if (!neib) {
																	var neib = new Planet();
																	neib.coordinates = [0,0,0];
																}
																if (!err) {
																	function saveIfNotExists(newPlanet, neib) {
																		for (var x = 0; x < 3; x++) {
																			var op = Math.floor((Math.random() * 2) + 1);
																			if (op == 1) newPlanet.coordinates[x] = neib.coordinates[x] + Math.floor((Math.random() * 10) + 1);
																			else newPlanet.coordinates[x] = neib.coordinates[x] - Math.floor((Math.random() * 10) + 1);
																		}
																		Planet.findOne({'coordinates': newPlanet.coordinates}, function(err, result) {
																			if (err) throw err;
																			if (!result) {
																				newPlanet.save(function(err) {
																					if (err) throw err;
																					else return done(null, newUser);
																				});
																			}
																			else saveIfNotExists(newPlanet, neib);
																		});
																	}
																	saveIfNotExists(newPlanet, neib);
																}
															}).limit(1).skip(Math.floor((Math.random() * (count-1)) + 0));
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		});
	}
));
passport.use('local-login', new LocalStrategy({
   usernameField: 'login',
   passwordField: 'password',
   passReqToCallback : true
},
function(req, login, password, done) {
    User.findOne({'local.login': login}, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.validPassword(password)) return done(null, false);
      return done(null, user);
    });
  }
));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
