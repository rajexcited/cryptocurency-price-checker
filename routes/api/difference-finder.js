var coinPricer = require('./exchange'),
	fiatValueComputer = require('../../lib/fiat-value'),
	helperData = require('../../lib/helper-data'),
	currencyRatePricer = require('./foreign-pricer'),
	axios = require('axios');

function getDifference(usdCrypto, inrCrypto, foriegnRate, howMuchUSD, additionalPercentFees) {
	var usCoins = (howMuchUSD / usdCrypto.usdPerCoin),
		inrCoins = (howMuchUSD * foriegnRate / inrCrypto.inrPerCoin),
		savedUsd = (usCoins - inrCoins) * usdCrypto.usdPerCoin,
		percentage = (savedUsd * 100 / howMuchUSD);

	return {
		coinsFee: fiatValueComputer(additionalPercentFees, usCoins),
		usdFee: fiatValueComputer(additionalPercentFees, howMuchUSD),
		coins: (usCoins - inrCoins),
		usd: savedUsd,
		percent: percentage
	};
}

function getTickerRespose(usdCoin, inrCoin, foriegnRate, howMuchUSD, tickerId) {
	var additionalPercentFees = 3.0,
		diff;

	diff = getDifference(usdCoin, inrCoin, foriegnRate, howMuchUSD, additionalPercentFees);

	return {
		"coin-id": tickerId.toUpperCase(),
		"coin-rate": {
			"usd": {
				"exchange-names": usdCoin.exchangeName,
				"price": usdCoin.usdPerCoin.toFixed(2)
			},
			"inr": {
				"exchange-names": inrCoin.exchangeName,
				"price": inrCoin.inrPerCoin.toFixed(2),
				"coins": (howMuchUSD * foriegnRate / inrCoin.inrPerCoin).toFixed(7)
			},
			"info": "this is including fees charged (trading, deposit, withdrawal) by USA and India exchanges."
		},
		"additional-fees": {
			"percentage": additionalPercentFees.toFixed(2),
			"fiat-usd": diff.usdFee.toFixed(2),
			"fiat-coin": diff.coinsFee.toFixed(7),
			"info": "maintainance cost, server security cost, loan interest charged, tax,  other unknown cost"
		},
		"difference": {
			"without-fees": {
				"by-coins": diff.coins.toFixed(7),
				"by-usd": diff.usd.toFixed(2),
				"by-percentage": diff.percent.toFixed(2)
			},
			"with-fees": {
				"by-coins": (diff.coins - diff.coinsFee).toFixed(7),
				"by-usd": (diff.usd - diff.usdFee).toFixed(2),
				"by-percentage": (diff.percent - additionalPercentFees).toFixed(2)
			},
			"info": "positive = profit, negative = loss;\t\t computed for given USD considering foriegn exchange rate.;\t"
		}
	};
}

module.exports = function findDifferences(howMuchUSD) {
	var promises = [];

	promises.push(currencyRatePricer());
	promises.push(coinPricer('gdax'));
	promises.push(coinPricer('koinex'));

	return axios.all(promises).then(function(responses) {
		var tickerData,
		    foriegnRate = responses[0];
		
		tickerData = helperData.tickers.map(function(tickerId) {
			return {
				"coin": getTickerRespose(responses[1][tickerId], responses[2][tickerId], foriegnRate, howMuchUSD, tickerId)
			};
		}).sort(function(a, b) {
			return Number(b.coin.difference['without-fees']['by-usd']) - Number(a.coin.difference['without-fees']['by-usd']);
		});

		return {
			"rates": {
				"foreign-price": {
					"inr-rate-based-usd": foriegnRate.toFixed(2),
					"usd-amount": howMuchUSD.toFixed(2),
					"inr-amount": (howMuchUSD * foriegnRate).toFixed(2)
				},
				"coin-list": tickerData
			}
		};
	});
}
