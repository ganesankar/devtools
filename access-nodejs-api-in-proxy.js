require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var https = require('https').globalAgent.options.secureProtocol = 'TLSv1_method';;
var http = require('http');
var request = require('request');
var tunnel = require('tunnel');

var tunnelingAgent = tunnel.httpsOverHttp({
	proxy: {
		host: '10.87.21.34',
		port: 80,
		headers: {
			'User-Agent': 'Node.js/0.6.6',
			'Proxy-Connections': 'keep-alive',
		}
	}
});

app.set('view engine', 'html');
app.use(cors());
app.use(function (req, res, next) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.all('/api', function(req, res, next) {
    console.log("F1");	
	var options = {
		agent: tunnelingAgent,
		method: 'GET', 
		uri: 'http://jsonplaceholder.typicode.com/posts',
		ciphers: 'ALL',
    	secureProtocol: 'TLSv1_method',
	};
	request(options, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	 	console.log('body:', response.body); // Print the HTML for the Google homepage.
		res.status(200).send(response.body)
	});
  });

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
