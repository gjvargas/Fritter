var express = require('express');
var router = express.Router();
var user = "anonymous";

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Fritter'});
});

router.get('/new', function(req, res) {
	res.render('new', { title: 'Make a new Post' });
});

router.post('/login', function (req, res, next) {

  if(err) {
    res.send("There was a problem");
  } else {
    res.redirect("/posts");
  }
});


router.get('/signup', function(req, res) {
  res.render('signup', { title: ' Create a New Account!' });
});

router.post('/create', function(req, res, next) {
  var db = req.db;
  var users = db.get('users');
  var pass = users.find({user: req.body.user}, {password: 1});
  if(users.find({user: req.body.user}, {password: 1})) {

  }
  users.insert({"user": req.body.user, "password": req.body.password}, function(err, docs){
  if(err) {
    res.send("There was a problem");
    } else {
      res.redirect("/posts");
    }
  });
});

router.get('/posts', function(req, res) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, function(e, docs){
    res.render('posts', {'posts': docs });
  });
});


router.post('/post', function(req, res, next) {
	var db = req.db;
  var posts = db.get('posts');
	posts.insert({"title": req.body.title, "post": req.body.post}, function(err, docs){
	if(err) {
		res.send("There was a problem");
		} else {
			res.redirect("/");
		}
	});
});


module.exports = router;
