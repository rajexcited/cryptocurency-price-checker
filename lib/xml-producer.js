var xmlExtMatcher = /\.xml$/,
	jsontoxml = require('jsontoxml'),
	rewrite = require('express-urlrewrite');

function xmlOrJson(shouldRenderXML, data) {
	var res = this;
	if(shouldRenderXML) {
		res.header('Content-Type','text/xml').send(jsontoxml(data, true));
	} else {
		res.json(data);
	}
	return res;
}

module.exports = function (options) {
	var handler = rewrite(/\/(.+)\.xml$/, '/$1');
	return function (req, res, next) {
		var shouldRenderXML = xmlExtMatcher.test(req.url);
		res.xmlOrJson = xmlOrJson.bind(res, shouldRenderXML);
		handler.call(this, req, res, next);
	};
};
