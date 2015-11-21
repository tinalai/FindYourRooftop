var express = require('express');
var path = require('path');
var bodyParser  = require('body-parser');
var request = require('request');
var app = express();
var Promise = require('bluebird');
var query = require('./queries.js');
var mid = require('./middleware.js');
var session = require('express-session');
var http = require('http');
var menu = require('./findmenu.js')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/..'));


app.use(session({
  secret: "test",
  resave: false,
  saveUninitialized: true
}));


var listRouter = express.Router();

listRouter.post('/', query.getList, function(req, res) {
  console.log('getting a POST request for /list');
  res.send(res.bars);
})

listRouter.get('/', function(req, res) {
  console.log('getting a GET request for /list/');
  res.send('session created');
})


var userRouter = express.Router();

// userRouter.get('/login', function(req, res) {
//   console.log('###### JUST GOT LOGIN REQUEST #######');
//   res.sendFile(path.join(__dirname + '../client/register.html'));
// })

userRouter.post('/login', function(req, res) {
  mid.validateLogin(req, res);
})

// userRouter.get('/signup', function(req, res) {
//   console.log('GET REQUEST TO SIGNUP PAGE');
//   res.sendFile(path.join(__dirname + '../client/register.html'));
// })

userRouter.post('/signup', function(req, res) {
  mid.processSignup(req, res);
  // console.log('user was just added to database, redirecting to main');
  // res.redirect('/');
})

userRouter.get('/logout', function(req, res) {
  console.log('Before destroy ' + req.session.id);
  req.session.destroy(function() {
    console.log('destroyed')
    res.send('You\'ve been logged out!');
  })
  console.log('Session is: ' + req.session);
})

// userRouter.post('/add', mid.checkUser, function(req, res) {
//   res.send('success');
// })

var menuRouter = express.Router();
menuRouter.post('/', menu.downloadMenu, function(req, res, next) {
  res.send(res.menu);
})

// apply routes to application
app.use('/list', listRouter);
app.use('/user', userRouter);
app.use('/menu', menuRouter);

app.listen(3000);

module.exports = app;

