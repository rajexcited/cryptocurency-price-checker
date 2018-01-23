var router = require('express').Router({
		mergeParams: true
	}),
	producer = require('../../lib/producer-xml-json'),
	diffFinder = require('./difference-finder');


function exchangehandle(req, res, next) {
	var toXmlOrJson = this.bind(null, res),
		howMuchUSD = Number(req.params.howMuchUSD);

	diffFinder(howMuchUSD).then(toXmlOrJson).catch(next);
}

router.get('/difference/usd/:howMuchUSD/exchange', exchangehandle.bind(producer.toXML));
router.get('/difference/usd/:howMuchUSD/exchange.json', exchangehandle.bind(producer.toJSON));

module.exports = router;