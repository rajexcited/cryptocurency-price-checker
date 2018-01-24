var router = require('express').Router({
		mergeParams: true,
		strict: true,
		caseSensitive: true
	}),
	producer = require('../../lib/producer-xml-json'),
	diffFinder = require('./difference-finder');

function highestExchangeHandler(req, res, next) {
	var response = res.data;
	res.data = {
		"rates": {
			"foreign-price": response.rates['foreign-price'],
			"best-coin-rate": response.rates['coin-list'][0]
		}
	};
	next();
}

function showMeHandler(req, res, next) {
	var response = res.data,
		showMeId = req.params.showMeId;

	res.data = {
		"rates": {
			"foreign-price": response.rates['foreign-price']
		}
	};
	if (showMeId === 'profits') {
		res.data.rates['best-coin-rate'] = {
			"coin": {
				"coin-id": response.rates['best-coin-rate'].coin['coin-id'],
				"profit": {
					"without-fees": response.rates['best-coin-rate'].coin.difference['without-fees'],
					"info": response.rates['best-coin-rate'].coin.difference.info
				}
			}
		};
	}

	next();
}

router.param('howMuchUSD', function(req, res, next, usdValue) {
	var howMuchUSD = Number(usdValue);
	diffFinder(howMuchUSD).then(function(response) {
		res.data = response;
		next();
	}).catch(next);
});

router.get('/difference/usd/:howMuchUSD/exchange', producer.toXML);
router.get('/difference/usd/:howMuchUSD/exchange.json', producer.toJSON);

router.get('/difference/usd/:howMuchUSD/exchange/profit/highest', highestExchangeHandler, producer.toXML);
router.get('/difference/usd/:howMuchUSD/exchange/profit/highest.json', highestExchangeHandler, producer.toJSON);

router.get('/difference/usd/:howMuchUSD/exchange/profit/highest/showme/:showMeId', highestExchangeHandler, showMeHandler, producer.toXML);

module.exports = router;