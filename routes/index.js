var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

/* GET home page. */
router.get('/', function(req, res) {
  req.session.user = null;
  res.render('index', {title: 'Fritter'});
});

router.get('/new', function(req, res) {
	res.render('new', { title: 'Make a new Post' });
});

router.get('/signout', function (req, res, next) {
  res.redirect('/');
});

router.post('/login', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');
  users.find({user: req.body.user}, {password: 1}, function(err, docs){
    if(err) {
      res.send("There was a problem");
    } else if(docs.length == 0) {
      res.send("Username doesn't exist.");
    } else if(req.body.pass != docs[0].password) {
      res.send("Incorrect password.");
    } else {
      req.session.user = req.body.user;
      res.redirect("/posts");
    }
  });
});


router.get('/signup', function(req, res) {
  res.render('signup', { title: ' Create a New Account!' });
});

router.post('/create', function(req, res, next) {
  var db = req.db;
  var users = db.get('users');
  users.find({user: req.body.user}, {password: 1}, function(e, docs) {
    if(docs.length > 0) {
      res.send("Sorry. Username already exists.");
    } else if(req.body.user.length < 4) {
      res.send("Username is too short.")
    } else if(req.body.pass != req.body.pass2) {
      res.send("Passwords do not match.");
    } else {
      users.insert({"user": req.body.user, "password": req.body.pass}, function(e, docs){
      if(e) {
        res.send("There was a problem");
        } else {
          req.session.user = req.body.user;
          res.redirect("/posts");
        }
      });
    }
  });


});

router.get('/posts', function(req, res) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, function(e, docs){
    res.render('posts', {title: "Welcome to Fritter, " + req.session.user + "!", 'posts': docs, 'user': req.session.user});
  });
});


router.post('/post', function(req, res, next) {
	var db = req.db;
  var posts = db.get('posts');
  if(req.body.title.length > 0 && req.body.post.length > 0) {
  	posts.insert({"title": req.body.title, "post": req.body.post, "user": req.session.user}, function(err, docs){
  	if(err) {
  		res.send("There was a problem");
  		} else {
  			res.redirect("/posts");
  		}
  	});
  }
});

router.post('/edit', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.remove({"title": req.body.orig_title, "post": req.body.orig_post, "user": req.session.user}, function(err, docs){
  if(err) {
    res.send("There was a problem");
    }
  });
  if(req.body.title.length > 0 && req.body.post.length > 0) {
    posts.insert({"title": req.body.title, "post": req.body.post, "user": req.session.user}, function(err, docs){
    if(err) {
      res.send("There was a problem");
      } else {
        res.redirect("/posts");
      }
    });
  }
});

router.post('/delete', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.remove({"title": req.body.title, "post": req.body.post, "user": req.session.user}, function(err, docs){
  if(err) {
    res.send("There was a problem");
    } else {
      res.redirect("/posts");
    }
  });
});


module.exports = router;