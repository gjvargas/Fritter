var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, function(e, docs){
    res.render('index', { title: 'Twitter Clone', 'posts': docs });
  });
});

router.get('/new', function(req, res) {
	res.render('new', { title: 'Make a new Post' });
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
