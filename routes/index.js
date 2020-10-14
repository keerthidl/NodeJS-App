var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
	// render to views/index.ejs template file
	res.render('index', {title: 'My Node.js Application'})
})


module.exports = router;
