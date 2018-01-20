var axios = require('axios'),
	caxios = require('../../../lib/caxios')(),
	helperData = require('../../../lib/helper-data'),
	fiatValueComputer = require('../../../lib/fiat-value');

function getTickerPrice(tickerId) {
	return caxios({method: 'get', url: 'https://api.gdax.com/products/'+tickerId.toLowerCase()+'-usd/ticker', ttl: 60})
		.then(function (response) {
			return response.data.price;
		});
}

function getAllProducts() {
	var allProducts = {}, promises;
	promises = helperData.tickers.map(function (tickerId) {
		return getTickerPrice(tickerId).then(function (price) {
			allProducts[tickerId] = {
				usdPerCoin: fiatValueComputer(helperData.fees['gdax-us'], price, 'more'),
				tickerId: tickerId,
				exchangeName: 'Global Digital Asset Exchange (gdax)'
			};
			return allProducts;
		});
	});

	return axios.all(promises).then(function () {
		return allProducts;
	});
}

module.exports = function () {
	return getAllProducts();
};
