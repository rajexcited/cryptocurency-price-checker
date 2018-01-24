var jsontoxml = require('json2xml');

function toXML(req, res) {
	res.header('Content-Type', 'text/xml').send(jsontoxml(res.data, {
		header: true
	}));
}

function xmlOrJson(req, res) {
	var mime_type = req.mime_type;
	if (mime_type === 'xml') {
		toXML(req, res);
	} else if (mime_type === 'json') {
		res.json(res.data);
	}
}

module.exports = {
	toXML: toXML,
	toJSON: function(req, res) {
		res.json(res.data);
	},
	xmlOrJSON: xmlOrJson
};