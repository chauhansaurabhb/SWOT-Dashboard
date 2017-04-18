/**
 * New node file
 */
var net = require('net'); 
var HOST = '192.168.0.103'; 
var PORT = 6969; // TCP LISTEN port 
var http = require('http');
var fs = require('fs');
var port = 8686;
var path = require('path');
var EventEmitter = require('events');
var socketio = new EventEmitter();


net.createServer(function(sock) {
//	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort); 
	sock.on('data', function(data) {
		console.log("Received msg in node server "+data);
		var m3suggestion=JSON.parse(data);
		var suggestion=m3suggestion.suggestionInfo;
		var deduceInfo=m3suggestion.deduceInfo;
		var images=[];
		for(i in suggestion){
			images.push('images/'+suggestion[i]+'.jpg');
		}
		console.log("suggestion is"+suggestion);
		console.log("deduceInfo is "+deduceInfo);
		console.log("Images are "+images);
		
		
		/* socket.emit('m3data', {
			  image:images,
			  label: deduceInfo,
			  title:suggestion
		 });*/
		
		 socketio.emit('m3data', {
			 image:images,
			  label:suggestion,
			  title:deduceInfo
		 });	
		//sock.write(data); 
		}); 

	// Add a 'close' - "event handler" in this socket instance 
	sock.on('close', function(data) { 
		//console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort); 
		}); 
	}).listen(PORT, HOST); 


function handleRequest(request, response){

    var filePath = path.join(__dirname, 'index.html' );
    var stat = fs.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(response);	   	
}


var server = http.createServer(handleRequest);

var io = require('socket.io').listen(server);

server.listen(port, "0.0.0.0", function(){

    console.log("Server listening on: http://localhost:%s", port);
});


io.sockets.on('connection', function (socket) {
  socketio = socket; 
 });


