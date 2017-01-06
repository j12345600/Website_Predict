var http = require("http");
var url = require('url');
var fs = require('fs');
// var r=require('./read.js')();
var moment=require('moment');
var server = http.createServer(function(request, response) {
  console.log('Connection');
  var path = url.parse(request.url).pathname;

  switch (path) {
    case '/':
      fs.readFile(__dirname + '/index.html', function(error, data) {
        if (error){
          response.writeHead(404);
          response.write("opps this doesn't exist - 404");
        } else {
          response.writeHead(200, {"Content-Type":  "text/html"});
          response.write(data, "utf8");
        }
        response.end();
      });
      break;
   case '/data':
   case '/data.json':
   fs.readFile(__dirname + '/result.txt', function(error, data) {
     if (error){
       response.writeHead(404);
       response.write("opps this doesn't exist - 404");
     } else {
       response.writeHead(200, {"Content-Type":  "application/json"});
       response.write(data, "utf8");
     }
     response.end();
   });
  break;
   case '/w':
   case '/weather':
 	fs.readFile(__dirname + '/weather.txt', function(error, data) {
     if (error){
       response.writeHead(404);
       response.write("opps this doesn't exist - 404");
     } else {
       response.writeHead(200, {"Content-Type":  "application/json"});
       response.write(data, "utf8");
     }
     response.end();
   });
  break;

    default:
      response.writeHead(404);
      response.write("opps this doesn't exist - 404");
      response.end();
      break;
  }
});

server.listen(2132);
// var serv_io = io.listen(server);
// serv_io.
//   sockets.on('connection', function(socket) {
//   setInterval(function() {
//     socket.emit('date', {'date': new Date()});
//   }, 100);
//   socket.on('client_data',function(data){
//     process.stdout.write(data.letter);
//   });
// });
