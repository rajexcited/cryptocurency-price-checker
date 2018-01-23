var jsontoxml = require('json2xml');

function toXML(res, data) {
	res.header('Content-Type', 'text/xml').send(jsontoxml(data, {
		header: true
	}));
}

function xmlOrJson(mime_type, res, data) {
	if (mime_type === 'xml') {
		toXML(res, data);
	} else if (mime_type === 'json') {
		res.json(data);
	}
}

module.exports = {
	toXML: toXML,
	toJSON: function(res, data) {
		res.json(data);
	},
	xmlOrJSON: xmlOrJson
};