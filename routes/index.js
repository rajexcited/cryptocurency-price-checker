var router = require('express').Router({strict:true}),
	path = require('path'),
	file_path = path.resolve(__dirname, 'list-of-links.html');

router.use('/list-of-links', function (req, res, next) {
	res.sendFile(file_path);
});

router.use('/api', require('./api'));

router.use('/', function (req, res, next) {
	res.sendFile(file_path);
});

module.exports = router;