angular.module('register', [])

.controller('formController', function($scope, $http, $location) {

	$scope.submitLogin = function(email, pass) {
		console.log('login input is ' + email + pass);
		$scope.email = '';
		$scope.pass = '';
		$http({
			method: "POST",
			url: "/user/login",
			data: {email: email, password: pass},
			headers: {
        "Content-Type": "application/JSON"
      }
		})
		.then(function(response) {
			console.log('Res.data says: ' + response.data);
			if (response.data === 'session created') {
				console.log('successful login');
				$location.path('/');
			} else if (response.data === 'user not found') {
				alert('user not found');
				$location.path('/signup');
			} else if (response.data === 'wrong password') {
				alert('password incorrect');
				$location.path('/signup');
			} else if (response.data === 'db error') {
				console.log('database error');
				$location.path('/signup');
			} else if (response.data === 'logged in') {
				console.log('user is already logged in');
				$location.path('/');
			}
		})
		.catch(function(data, status) {
			console.error('there was an error logging in');
			console.log(response.status, response.data);
		});
	};
// then handleresponse(response)
	$scope.submitSignup = function(email, pass) {
		$scope.email = '';
		$scope.pass = '';
		$http({
			method: "POST",
			url: "/user/signup",
			data: {email: email, password: pass},
			headers: {
        "Content-Type": "application/JSON"
      }
		}).then(function(response) {
			if (response.data === 'session created') {
				console.log('redirecting to main');
				$location.path("/");
			} else if (response.data === 'email exists') {
				console.log('email is taken');
				alert('there is already a user with that email address');
			}
		}, function(response) {
			console.log('there was an error with signup');
			$location.path("/signup");
		});
	};

});
