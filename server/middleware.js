var query = require('./queries');
var bcrypt = require('bcrypt');
var session = require('express-session');
var promisify = require("promisify-node");

exports.validateLogin = function(req, res) {
	var em = req.body.email;
	var pass = req.body.password;
	var user = {email: em, password: pass};
	// if (req.session) {
	// 	res.send('logged in');
	// }

	console.log('finding user: ' + em);
	query.findUser(req, res, user, loginCallback);
};

var loginCallback =	function(req, res, user, foundUser) {
		console.log('(loginCB) user was found in db username is ' + foundUser.email);
		console.log('(loginCB) user password ' + foundUser.password);
		// test given password against saved
		if (foundUser.password === user.password) {
			// if match, create session
			console.log('PASSWORDS MATCH');
			createSession(req, res, foundUser);
		} else {
			console.log('Error, incorrect password');
			res.send('wrong password');
		}
};

function signupCallback(req, res, user) {
	if (user === null) {
		console.log('(signupCB) cant use that');
	} else {
		console.log('(signupCB) new user is ' + user.email);
		createSession(req, res, user);
	}
}

exports.processSignup = function(req, res, next) {
	var em = req.body.email;
	var pass = req.body.password;
	var newUser = {email: em, password: pass};
	console.log('processing signup for ' + em);

	query.addUser(req, res, newUser, signupCallback);
};


function createSession (req, res, newUser) {
	console.log('creating session');
	// if (req.session) {
	// }
  return req.session.regenerate(function() {
    req.session.user = newUser;
    console.log(req.session.user);
    res.send("session created");
  });
}

exports.checkUser = function(req, res, next){
  if (!isLoggedIn(req)) {
    res.redirect('/signup');
  } else {
    next();
  }
};

var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};
