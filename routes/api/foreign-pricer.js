var caxios = require('../../lib/caxios')();

function getForiegnRate(symbol) {
	var params = {
		base: 'USD', 
		symbols: symbol
	};
	return caxios({method: 'get', url: 'https://api.fixer.io/latest', params: params, ttl: 300})
		.then(function (response) {
			return response.data.rates[symbol];
		});
}

module.exports = function callForeignPricer() {
	return getForiegnRate('INR');
}