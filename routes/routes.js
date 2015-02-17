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
			var structure_type = '';
			if (structure == 'gold_mine' || structure == 'oil_rig' || structure == 'gas_rig' || structure == 'metal_mine') structure_type = 'income';
			else if (structure == 'observatory' || structure == 'laboratory') structure_type = 'technology';
			else if (structure == 'missile' || structure == 'heavy_missile' || structure == 'antimatter') structure_type = 'weapons';
			console.log(structure_type); // COmMENT
			Structure.findOne({'owner': req.user._id}, function (err, structures) {
				if(!err && structures) {
					console.log('got structures'); // COmMENT
					Cost.findOne({'id': 1}, function (err, costs) {
						if(!err && costs) {
							console.log('got costs'); // COmMENT
							Wallet.findOne({'owner': req.user._id}, function (err, wallet) {
								if(!err && wallet) {
									console.log('got wallet'); // COmMENT
									if (
										wallet.cash >= costs[structure].cash * structures[structure_type][structure] &&
										wallet.oil >= costs[structure].oil * structures[structure_type][structure] &&
										wallet.gas >= costs[structure].gas * structures[structure_type][structure] &&
										wallet.metal >= costs[structure].metal * structures[structure_type][structure]
									) {
										Wallet.update(
											{'owner': req.user._id},
											{
												$set: {
													'cash': wallet.cash - costs[structure].cash * structures[structure_type][structure],
													'oil': wallet.oil - costs[structure].oil * structures[structure_type][structure],
													'gas': wallet.gas - costs[structure].gas * structures[structure_type][structure],
													'metal': wallet.metal - costs[structure].metal * structures[structure_type][structure]
												}
											},
											function (err) {
												if(err) console.log(err);
												else {
													console.log('wallet updated'); // COmMENT
													var query = {$set: {}};
													query.$set[structure_type +'.'+ structure] = structures[structure_type][structure] + 1;
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

	// OBSERVATORY
	app.get('/observatory', isLoggedIn, function (req, res, next) {
		Structure.findOne({'owner': req.user._id}, function (err, structures) {
			if(!err && structures) {
				Cost.findOne({'id': 1}, function (err, costs) {
					if(!err && costs) res.render('observatory', {'structures': structures, 'costs': costs});
					else console.log(err);
				});
			}
			else console.log(err);
		});
	});
	// OBSERVATORY
	app.post('/observatory', isLoggedIn, function (req, res, next) {
		var action = req.body.action;
		if (action == 'load-spacemap') {
			Structure.findOne({'owner': req.user._id}, function (err, structures) {
				if(!err && structures) {
					var oblvl = structures.technology.observatory;
					Planet.findOne({'owner': req.user._id}, function (err, ownerplanet) {
						if (!err && ownerplanet) {
							Planet.find({
								'coordinates.x': { $gte: ownerplanet.coordinates.x - 4 + oblvl },
								'coordinates.x': { $lte: ownerplanet.coordinates.x + 4 + oblvl },
								'coordinates.y': { $gte: ownerplanet.coordinates.y - 4 + oblvl },
								'coordinates.y': { $lte: ownerplanet.coordinates.y + 4 + oblvl }
								}).exec(function (err, planets) {
									if(err) {res.send('fail'), console.log(err)}
									else if(!err && planets) {planets.push(oblvl +':'+ ownerplanet.coordinates.x +':'+ ownerplanet.coordinates.y); res.send(planets);}
								}
							);
						}
					});
				}
			});
		}
		else if (action == 'get-spaceobjdetails') {
			var coordinates = req.body.coordinates.split(':');
			Planet.findOne({'coordinates.x': coordinates[0], 'coordinates.y': coordinates[1]}, function (err, objdetails) {
				if(err) {console.log(err); res.send('fail');}
				else {
					User.findOne({'_id': objdetails.owner}, function (err, owner) {
						if (err) {console.log(err); res.send('fail');}
						else {
							var resdata = [objdetails, owner, req.user._id];
							res.send(resdata);
						}
					});
				}
			});
		}
	});

	//WEAPONS
	app.get('/weapons', isLoggedIn, function (req, res, next) {
		Structure.findOne({'owner': req.user._id}, function (err, structures) {
			if(!err && structures) {
				Cost.findOne({'id': 1}, function (err, costs) {
					if(!err && costs) res.render('weapons', {'structures': structures, 'costs': costs});
					else console.log(err);
				});
			}
			else console.log(err);
		});
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
	// DEFENSE
	app.get('/defense', isLoggedIn, function (req, res) {
		Structure.findOne({'owner': req.user._id}, function (err, structures) {
			if(!err && structures) {
				Cost.findOne({'id': 1}, function (err, costs) {
					if(!err && costs) res.render('defense', {'structures': structures, 'costs': costs});
					else console.log(err);
				});
			}
			else console.log(err);
		});
	});

	// EDIT PROFILE
	app.get('/editprofile', isLoggedIn, function (req, res, next) {
		User.findOne({'_id': req.user._id}, function (err, user){
			if(!err && user) res.render('editprofile', {'user': user});
			else console.log(err);
		});
	});
	// EDIT PROFILE
	app.post('/editprofile', isLoggedIn, function (req, res, next) {
		var us = '', lo = '', pa = '';
		if (typeof(req.body.username) != 'undefined') us = req.body.username;
		if (typeof(req.body.login) != 'undefined') lo = req.body.login;
		if (typeof(req.body.password) != 'undefined') pa = req.body.password;
		if (us.length == 0) us = req.user.local.username;
		if (lo.length == 0) lo = req.user.local.login;
		if (pa.length == 0) pa = req.user.local.password;
		User.update(
			{'owner': req.user._id}, 
			{$set: {
				'local.username': us,
				'local.login': lo,
				'local.password': pa
				}
			},
			function (err) {
				if (err) console.log(err);
				else res.redirect('/dashboard');
			}
		);
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