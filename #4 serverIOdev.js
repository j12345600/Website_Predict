var http = require("http");
var url = require('url');
var fs = require('fs');
var moment=require('moment');
var express = require('express');
var path = require('path');
var apis = require('./api.router');
var app = express();
var port = 2132;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'public/html/index.html'));
});
app.use('/api',apis);
app.listen(port);
console.log("listening on port ",port);
