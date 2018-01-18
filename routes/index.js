var router = require('express').Router();

router.use('/test', function (req, res, next) {
	res.xmlOrJson({"message": "Welcome test User!"});
});

module.exports = router;