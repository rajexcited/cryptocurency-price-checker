var caxios = require('../../lib/caxios')();

function getForiegnRate(symbol, base) {
	var params = {
		access_key: 'd5ad69c8d915b5f426666ff72969e73a',
		symbols: symbol.concat(',', base)
	};
	return caxios({method: 'get', url: 'http://data.fixer.io/api/latest', params: params, ttl: 300})
		.then(function (response) {
			return response.data.rates[symbol]/response.data.rates[base]
		});
}

module.exports = function callForeignPricer() {
	return getForiegnRate('INR', 'USD');
}
