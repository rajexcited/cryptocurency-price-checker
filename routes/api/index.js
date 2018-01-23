var router = require('express').Router({
		mergeParams: true
	}),
	producer = require('../../lib/producer-xml-json'),
	diffFinder = require('./difference-finder');

function getBestDifference(howMuchUSD) {
	return diffFinder(howMuchUSD).then(function(response) {
		return {
			"rates": {
				"foreign-price": response.rates['foreign-price'],
				"best-coin-rate": response.rates['coin-list'][0]
			}
		};
	});
}

function exchangeHandle(getDiffFn, req, res, next) {
	var toXmlOrJson = this.bind(null, res),
		howMuchUSD = Number(req.params.howMuchUSD);

	getDiffFn(howMuchUSD).then(toXmlOrJson).catch(next);
}

router.get('/difference/usd/:howMuchUSD/exchange', exchangeHandle.bind(producer.toXML, diffFinder));
router.get('/difference/usd/:howMuchUSD/exchange.json', exchangeHandle.bind(producer.toJSON, diffFinder));

router.get('/difference/usd/:howMuchUSD/exchange/best', exchangeHandle.bind(producer.toXML, getBestDifference));
router.get('/difference/usd/:howMuchUSD/exchange/best.json', exchangeHandle.bind(producer.toJSON, getBestDifference));

module.exports = router;