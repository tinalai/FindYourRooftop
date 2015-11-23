var fire = require('firebase');
var Fireproof = require('fireproof');
var Promise = require('bluebird');
var ref = new fire('https://rooftopapp.firebaseio.com/');
var fireproof = new Fireproof(ref);
Fireproof.bless(Promise);
var usersRef = fireproof.child('users');


// search queries
exports.getList = function(req, res, next) {
  res.bars = [];
  console.log(req.body.zipCode);
	if (req.body.city) {
		// console.log('got a city search for ' + req.body.city);
		queryDB(req, res, next, 'location/city', req.body.city);
	} else if (req.body.zipCode) {
		// console.log('got a zip search for ' + req.body.zipCode);
		queryDB(req, res, next, 'location/postal_code', req.body.zipCode);
	}
};

// helper for getList^
function queryDB(req, res, next, searchParam, queryParam) {
	console.log('going to look for bars in the db');
	fireproof.orderByChild(searchParam)
	.equalTo(queryParam)
	.on('child_added', function(snapshot) {
		res.bars.push(snapshot.val());
	})
	.then(function() {
		console.log('NEXT');
		next();
	});
}

// user queries
exports.addUser = function(req, res, user, callback) {
	// var found = false;

	// usersRef.once('value', function(snapshot) {
	// 	snapshot.forEach(function(childSnapshot) {
	// 		var userID = childSnapshot.key();
	// 		childSnapshot.ref().child('email').once('value', function(snapshot) {
	// 			var dbEmail = snapshot.val();
	// 			console.log('(addUser) checking ' + dbEmail);
	// 			if (dbEmail === user.email) {
	// 				console.log('(addUser) user email already exists');
	// 				found = true;
	// 				callback(req, res, null);
	// 			} else {
	// 				console.log('(addUser) not a match');
	// 			}
	// 		})
	// 	})
	// }, function() {
	// 	console.log('error in addUser');
	// 	res.send('db error');
	// })
	// .then(function() {
	// 	console.log('(addUserCB) GOT IT into the promise');
	// 	if (!found) {
	// 		console.log('(addUser) adding user');
			usersRef.push(user);
			callback(req, res, user);
	// 	}
	// 	if (found) {
	// 		console.log('(addUser) user email already exists');
	// 		res.send('email exists');
	// 	}
	// })
};

exports.findUser = function(req, res, user, callback) {
	console.log('going to look for user in db');
	var found;
	usersRef.orderByChild('email')
	.equalTo(req.body.email)
	.on('child_added', function(snapshot) {
		console.log('User was found: ');
		found = snapshot.val();
	}, function() {
		console.log('error in querying for user');
		res.send('db error');
	})
	.then(function() {
		console.log('(finduser) queries.js running callback');
		if (found) {
			console.log('(finduser) we found ' + found.email);
			callback(req, res, user, found);
		} else if (found === null) {
			console.log('the user is null');
			res.send('user not found');
		}
	});
};


// firebase's user creation method,
	// fireproof.createUser({
	// 	email: req.body.email,
	// 	password: req.body.password
	// }, function(error, userData) {
	//   if (error) {
	//     switch (error.code) {
	//       case "EMAIL_TAKEN":
	//         console.log("The new user account cannot be created because the email is already in use.");
	//         break;
	//       case "INVALID_EMAIL":
	//         console.log("The specified email is not a valid email.");
	//         break;
	//       default:
	//         console.log("Error creating user: ", error);
	//     }
	//   } else {
	//     console.log("Successfully created user account with uid:", userData.uid);
	//   }
	// })
	// .then(function () {
	// 	next();
	// })
	// }
