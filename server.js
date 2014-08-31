var express = require('express')
, app = express()
, server = require('http').createServer(app)
, swig = require('swig')
, io = require("socket.io").listen(server);

app.configure(function() {
	app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
  	//app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	//cache-control set for content
	app.use(express.static(__dirname + '/public', {maxAge: 3600}));
	app.use('/components', express.static(__dirname + '/components'));
	app.use('/js', express.static(__dirname + '/js'));
	app.use('/icons', express.static(__dirname + '/icons'));
	app.set('views', __dirname + '/views');
	//app.set('/first','first.html');
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	swig.setDefaults({cache: false});
	app.use(express.cookieParser('CLANDESTINE'));
	app.use(express.cookieSession ({
		key: 'app.test'
	}));
	app.use(app.router);
});

app.get('/', function(req, res) {
  res.render('index2.html');
});

server.listen(app.get('port'), 'localhost',function() {
	console.log('Express server on localhost and port' + app.get('port'));
});

io.on("connection", function (socket) {
	socket.on('createRoom', function(id) {
		socket.join(id);
	});
	
	socket.on("draw", function(mouseX,mouseY,mouseX2,mouseY2,rain,id) {
		console.log("IT WORKS");
		io.sockets.in(id).emit("draw",mouseX,mouseY,mouseX2,mouseY2,rain); //this is the key equivalent for drawing.
	});

});