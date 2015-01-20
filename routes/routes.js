var User = require('../models/user');

module.exports = function (app, passport) {

	app.get('*', function (req, res, next) {
		res.locals.loggedIn = (req.user) ? true : false;
		if (req.isAuthenticated()) res.locals.username = req.user.local.username || null;
		if (req.isAuthenticated()) res.locals.usertype = req.user.local.usertype || null;
		next();
	});

	// INDEX
	app.get('/', function (req, res, next) {
	  res.render('index', {title: 'Tgame'});
	});
	// INDEX
	app.post('/', function (req, res, next) {
		var action = req.body.action;
		if (action == 'uniq-username') {
			var username = req.body.username;
			User.findOne({'local.username': username}, function (err, result) {
				if(!err && !result) res.send('success');
				else res.send('fail');
			});
		}
		else if (action == 'uniq-login') {
			var login = req.body.login;
			User.findOne({'local.login': login}, function (err, result) {
				if(!err && !result) res.send('success');
				else res.send('fail');
			});
		}
	});

	// SIGNUP
	app.get('/signup', isLoggedOut, function (req, res) {
		res.render('signup', {'title': 'Rejestracja'});
	});
	// SIGNUP
	app.post('/signup', isLoggedOut, passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup'
	}));

	// LOGIN
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/'
	}));
	// LOGOUT
	app.get('/logout', isLoggedIn, function (req, res) {
		req.logout();
		res.redirect('/');
	});

}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	else res.redirect('/');
}
function isLoggedOut(req, res, next) {
	if (req.isAuthenticated()) res.redirect('/');
	else return next();
}