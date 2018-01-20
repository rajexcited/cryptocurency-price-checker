var jsontoxml = require('jsontoxml');

function xmlOrJson(mime_type, res, data) {
	if(mime_type==='xml') {
		res.header('Content-Type','text/xml').send(jsontoxml(data, true));
	} else if(mime_type==='json') {
		res.json(data);
	}
}

module.exports = {
	toXML: function(res, data){
		res.header('Content-Type','text/xml').send(jsontoxml(data, true));
	},
	toJSON: function(res, data){
		res.json(data);	
	},
	xmlOrJSON: xmlOrJson
};