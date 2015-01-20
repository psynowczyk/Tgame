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

	// SIGNUP
	app.get('/signup', isLoggedOut, function (req, res) {
		res.render('signup', {'title': 'Rejestracja'});
	});
	// SIGNUP
	app.post('/signup', isLoggedOut, passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup'
	}));

}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}
function isLoggedOut(req, res, next) {
	if (req.isAuthenticated()) res.redirect('/');
	return next();
}