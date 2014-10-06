var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

/* GET home page. AKA login screen*/
router.get('/', function(req, res) {
  req.session.user = null;
  res.render('index', {title: 'Fritter', message: req.session.login});
  req.session.login = null;
});

//Logs user out and redirects to login page
router.get('/signout', function (req, res, next) {
  res.redirect('/');
});

//logs user in
router.post('/login', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');
  //Finds the user in the database
  users.find({user: req.body.user}, {password: 1}, function(err, docs){
    //The following code notifies users of errors when logging in
    //Unidentified error
    if(err) {
      req.session.login = "Please keep trying.";
      res.redirect('/');
    }
    //username isn't in database
    else if(docs.length == 0) {
      req.session.login = "Username doesn't exist.";
      res.redirect('/');
    }
    //wrong password
    else if(req.body.pass != docs[0].password) {
      req.session.login = "Password is incorrect.";
      res.redirect('/');
    }
    //It worked! Signs user in and takes them to the posts.
    else {
      req.session.user = req.body.user;
      res.redirect("/posts");
    }
  });
});

//Renders the signup page so user can make new account
router.get('/signup', function(req, res) {
  res.render('signup', { title: ' Create a New Account!' });
});

//creates the new user in the database
router.post('/create', function(req, res, next) {
  var db = req.db;
  var users = db.get('users');
  //finds username in database
  users.find({user: req.body.user}, {password: 1}, function(e, docs) {
    //if name exists, pick other name
    if(docs.length > 0) {
      res.send("Sorry. Username already exists.");
    }
    //user name must be at least length 4
    else if(req.body.user.length < 4) {
      res.send("Username is too short.")
    }
    //mismatched passwords
    else if(req.body.pass != req.body.pass2) {
      res.send("Passwords do not match.");
    }
    //It worked! Add new user to database
    else {
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

//renders posts page for user
router.get('/posts', function(req, res) {
  //login is the login message, so if the user makes it here,
  //there is no longer a log in error message saved
  req.session.login = null;
  var db = req.db;
  //search database for posts
  var posts = db.get('posts');
  posts.find({}, function(e, docs){
    res.render('posts', {title: "Fritter", 'posts': docs.reverse(), 'user': req.session.user});
  });
});

//creates a new post
router.post('/post', function(req, res, next) {
	var db = req.db;
  var posts = db.get('posts');
  //makes sure post is nonempty
  var title = req.body.title;
  //null checks
  if(title == null) {
    title = "";
  }
  var post = req.body.post;
  if (post == null) {
    post = "";
  }
  if(title.length > 0 || post.length > 0) {
    //Success! adding post to database
  	posts.insert({"title": title, "post": post, "user": req.session.user}, function(err, docs){
  	if(err) {
  		res.send("There was a problem");
  		} else {
  			res.redirect("/posts");
  		}
  	});
  }
  else {
    res.redirect("/posts");
  }
});

router.post('/edit', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  var title = req.body.title;
  //null checks
  if(title == null) {
    title = "";
  }
  var post = req.body.post;
  if (post == null) {
    post = "";
  }
  //updates post only if input is nonempty
  if(title.length > 0 || post.length > 0) {
    posts.remove({"title": req.body.orig_title, "post": req.body.orig_post, "user": req.session.user}, function(err, docs){
    if(err) {
      res.send("There was a problem");
      }
    });
    posts.insert({"title": req.body.title, "post": req.body.post, "user": req.session.user}, function(err, docs){
    if(err) {
      res.send("There was a problem");
      } else {
        res.redirect("/posts");
      }
    });
  }
  else {
    res.redirect("/posts");
  }
});

//Deletes the post from database
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
