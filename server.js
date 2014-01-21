var http = require('http');
var querystring = require('querystring');
var htmlFile = require('fs').readFileSync('index.html');
var util = require('util');
var maxData = 2 * 1024 * 1024;

http.createServer(function(req, res){
	req.setEncoding('utf8');
	if(req.method === 'GET'){
		res.writeHead(200, {'Content-Type':'text/html'});
		res.end(htmlFile);
	}
	if(req.method === 'POST'){
		var postData = '';
		req.on('data', function(chunk){
			postData += chunk;
			if(postData > maxData){
				postData = '';
				this.pause();
				res.writeHead(413);
				res.end('POSTデータが大きすぎます!');
			}
		}).on('end', function(){
			if(!postData){res.end(); return;};
			var queryDataObject = querystring.parse(postData);
			console.log('ユーザーが次のデータをPOSTしました:\n' + postData);
			res.end('あなたがPOSTしたデータ:\n' + util.inspect(queryDataObject)
			);
		});
	}
}).listen(8080);