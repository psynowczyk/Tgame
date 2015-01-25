var User = require('../models/user');
var Wallet = require('../models/wallet');
var Planet = require('../models/planet');
var Notification = require('../models/notification');
var Structure = require('../models/structure');
var Cost = require('../models/cost');

module.exports = function (app, passport) {

	app.get('*', function (req, res, next) {
		res.locals.loggedIn = (req.user) ? true : false;
		if (req.isAuthenticated()) {
			res.locals.username = req.user.local.username || null;
			res.locals.usertype = req.user.local.usertype || null;
			Wallet.findOne({'owner': req.user._id}, function (err, result) {
				if(!err && result) {
					res.locals.cash = result.cash;
					res.locals.oil = result.oil;
					res.locals.gas = result.gas;
					res.locals.metal = result.metal;
					next();
				}
				else console.log(err);
			});
		}
		else next();
	});

	// INDEX
	app.get('/', function (req, res, next) {
		res.render('index');
	});
	// INDEX
	app.post('/', function (req, res, next) {
		var action = req.body.action;
		if (action == 'is-logged-in') {
			if (req.isAuthenticated()) res.send('success');
			else res.send('fail');
		}
		else if (action == 'get-notifications') {
			Notification.find({'owner': req.user._id}, function (err, result) {
				if(!err && !result) res.send(result);
				else res.send('fail');
			}).limit(10);
		}
		else if (action == 'uniq-username') {
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
		else if (action == 'get-costs') {
			if (req.isAuthenticated()) {
				Cost.findOne({'id': 1}, function (err, result) {
					if(!err && result) res.send(result);
					else res.send('fail');
				});
			}
		}
		else if (action == 'get-wallet') {
			if (req.isAuthenticated()) {
				Wallet.findOne({'owner': req.user._id}, function (err, result) {
					if(!err && result) res.send(result);
					else res.send('fail');
				});
			}
		}
	});

	// DASHBOARD
	app.get('/dashboard', isLoggedIn, function (req, res, next) {
		Planet.findOne({'owner': req.user._id}, function (err, planet) {
			if(!err && planet) res.render('dashboard', {'planet': planet.image});
			else console.log(err);
		});
	});

	// STRUCTURES
	app.get('/structures', isLoggedIn, function (req, res, next) {
		Structure.findOne({'owner': req.user._id}, function (err, structures) {
			if(!err && structures) {
				Cost.findOne({'id': 1}, function (err, costs) {
					if(!err && costs) res.render('structures', {'structures': structures, 'costs': costs});
					else console.log(err);
				});
			}
			else console.log(err);
		});
	});
	// STRUCTURES
	app.post('/structures', isLoggedIn, function (req, res, next) {
		var action = req.body.action;
		if (action == 'upgrade-structure') {
			var structure = req.body.structure;
			Structure.findOne({'owner': req.user._id}, function (err, structures) {
				if(!err && structures) {
					Cost.findOne({'id': 1}, function (err, costs) {
						if(!err && costs) {
							Wallet.findOne({'owner': req.user._id}, function (err, wallet) {
								if(!err && wallet) {
									if (
										wallet.cash >= costs[structure].cash * structures.income[structure] &&
										wallet.oil >= costs[structure].oil * structures.income[structure] &&
										wallet.gas >= costs[structure].gas * structures.income[structure] &&
										wallet.metal >= costs[structure].metal * structures.income[structure]
									) {
										Wallet.update(
											{'owner': req.user._id},
											{
												$set: {
													'cash': wallet.cash - costs[structure].cash * structures.income[structure],
													'oil': wallet.oil - costs[structure].oil * structures.income[structure],
													'gas': wallet.gas - costs[structure].gas * structures.income[structure],
													'metal': wallet.metal - costs[structure].metal * structures.income[structure]
												}
											},
											function (err) {
												if(err) console.log(err);
												else {
													var query = {$set: {}};
													query.$set['income.'+ structure] = structures.income[structure] + 1;
													Structure.update({'owner': req.user._id}, query, function (err) {
														if(err) {console.log(err); res.send('fail');}
														else res.send('success');
													});
												}
											}
										);
									}
									else res.send('fail:resources');
								}
								else console.log(err);
							});
						}
						else console.log(err);
					});
				}
				else console.log(err);
			});
		}
	});

	// SIGNUP
	app.get('/signup', isLoggedOut, function (req, res) {
		res.render('signup', {'title': 'Rejestracja'});
	});
	// SIGNUP
	app.post('/signup', isLoggedOut, passport.authenticate('local-signup', {
		successRedirect : '/dashboard',
		failureRedirect : '/signup'
	}));

	// LOGIN
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard',
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