var caxios = require('../../../lib/caxios')(),
	helperData = require('../../../lib/helper-data'),
	fiatValueComputer = require('../../../lib/fiat-value');

function getTickerPrice() {
	return caxios({method: 'get', url: 'https://koinex.in/api/ticker', ttl: 60})
		.then(function (response) {
			return response.data.prices;
		});
}

function getAllProducts() {
	return getTickerPrice().then(function (prices) {
		var allProducts = {};
		helperData.tickers.map(function (tickerId) {
			allProducts[tickerId] = {
				inrPerCoin: fiatValueComputer(helperData.fees['koinex-in'], prices[tickerId.toUpperCase()], 'less'),
				tickerId: tickerId,
				exchangeName: 'Koinex'
			};
		});

		return allProducts;
	});
}

module.exports = function () {
	return getAllProducts();
};

