'use strict';


var express = require('express');

var portno = 3000; 

var app = express();

app.use(express.static(__dirname));

var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
