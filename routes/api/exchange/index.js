var exchangehandlers = {
	"koinex" : require('./koinex-in'),
	"gdax" : require('./gdax-us')
};

module.exports = function getExchangeData(exchangeId) {
	return exchangehandlers[exchangeId]();
};