module.exports = function (app, passport) {

	app.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

}
