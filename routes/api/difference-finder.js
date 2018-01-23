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
		percentFee: fiatValueComputer(additionalPercentFees, percentage),
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
		"coin-id": tickerId,
		"coin-rate": {
			"USD-exchange": usdCoin.usdPerCoin.toFixed(2),
			"INR-exchange": inrCoin.inrPerCoin.toFixed(2),
			"exchange-names": {
				"US": usdCoin.exchangeName,
				"IN": inrCoin.exchangeName
			},
			"info": "this is including fees charged (trading, deposit, withdrawal) by USA and India exchanges."
		},
		"additional-fees": {
			"percentage": additionalPercentFees.toFixed(2),
			"fiat-usd": diff.usdFee.toFixed(2),
			"fiat-coin": diff.coinsFee.toFixed(2),
			"info": "maintainance cost, server security cost, loan interest charged, tax,  other unknown cost"
		},
		"difference": {
			"info": "positive = profit, negative = loss;\t\t computed for given USD considering foriegn exchange rate.;\t",
			"without-fees": {
				"by-coins": diff.coins.toFixed(7),
				"by-USD": diff.usd.toFixed(2),
				"by-percentage": diff.percent.toFixed(2)
			},
			"with-fees": {
				"by-coins": (diff.coins - diff.coinsFee).toFixed(7),
				"by-USD": (diff.usd - diff.usdFee).toFixed(2),
				"by-percentage": (diff.percent - diff.percentFee).toFixed(2),
			}
		}
	};
}


module.exports = function findDifferences(howMuchUSD) {
	var promises = [];

	promises.push(currencyRatePricer());
	promises.push(coinPricer('gdax'));
	promises.push(coinPricer('koinex'));

	return axios.all(promises).then(function(responses) {
		var foriegnRate = responses[0],
			tickerData;
		tickerData = helperData.tickers.map(function(tickerId) {
			return getTickerRespose(responses[1][tickerId], responses[2][tickerId], foriegnRate, howMuchUSD, tickerId);
		});

		return {
			"difference": {
				"foreign-price": {
					"INR-rate-based-USD": foriegnRate.toFixed(2),
					"USD-amount": howMuchUSD.toFixed(2),
					"INR-amount": (howMuchUSD * foriegnRate).toFixed(2)
				},
				"all-tickers": tickerData
			}
		};
	});
}