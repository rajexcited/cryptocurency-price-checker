var axios = require('axios'),
	NodeCache = require( "node-cache" ),
	myCache = new NodeCache( { stdTTL: 60, checkperiod: 65, useClones: false } ),
	hash = require('object-hash');

function getCache(cacheKey) {
	return new Promise(function (resolve, reject) {
		myCache.get(cacheKey, function (err, promiseValue) {
			if(promiseValue !== undefined) {
				resolve(promiseValue);
			} else {
				reject(err);
			}
		});
	});
}

function caxios() {
	var promixios={};

	return function (config) {
		var cacheKey;
		cacheKey = hash(config);
		
		return getCache(cacheKey)
			.catch(function (error) {
				if(!error) {
					if(!promixios[cacheKey]) {
						promixios[cacheKey] = axios(config);
						myCache.set(cacheKey, promixios[cacheKey]);
					}
					return promixios[cacheKey];
				}
				return Promise.reject(error);
			})
			.then(function (value) {
				delete promixios[cacheKey];
				return value;
			});
	}
}

module.exports = caxios;