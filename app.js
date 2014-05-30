var connect = require('connect'),
	fs = require('fs'),
	http = require('http');

var sendfile = function(_file) {
	return fs.readFileSync(_file, {
		encoding: 'utf8'
	});
}

var app = connect()
	.use(connect.logger('dev'))
	.use(connect.static('bower_components'))
	.use(function(_req, _res, _next) {
		switch (_req.url) {
			case '/':
				_res.end(sendfile('./public/index.html'));
				break;
			case '/one':
				_res.end(sendfile('./public/index.html'));
				break;
			case '/two':
				_res.end(sendfile('./public/index.html'));
				break;
			default:
				_next();
				break;
		}
	})
	.use(connect.static('public'));

http.createServer(app).listen(3030);

console.log('Server running: http://localhost:3030');