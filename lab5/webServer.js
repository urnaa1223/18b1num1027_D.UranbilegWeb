'use strict';

var express = require('express');

var portno = 3000;   

var app = express();

var cs142models = require('./modelData/photoApp.js').cs142models;

app.use(express.static(__dirname));

app.get('/', function (request, response) {
  response.send('Simple web server of files from ' + __dirname);
});

app.get('/test/:p1', function (request, response) {
  var param = request.params.p1;
  console.log('/test called with param1 = ', param);
  if (param !== "info") {
    console.error("Nothing to be done for param: ", param);
    response.status(400).send('Not found');
    return;
  }
  
  var info = cs142models.schemaInfo();
  
  if (info.length === 0) {
    response.status(500).send('Missing SchemaInfo');
    return;
  }
  response.status(200).send(info);
});


app.get('/user/list', function (request, response) {
  response.status(200).send(cs142models.userListModel());
  return;
});

app.get('/user/:id', function (request, response) {
  var id = request.params.id;
  var user = cs142models.userModel(id);
  if (user === null) {
    console.log('User with _id:' + id + ' not found.');
    response.status(400).send('Not found');
    return;
  }
  response.status(200).send(user);
  return;
});

app.get('/photosOfUser/:id', function (request, response) {
  var id = request.params.id;
  var photos = cs142models.photoOfUserModel(id);
  if (photos.length === 0) {
    console.log('Photos for user with _id:' + id + ' not found.');
    response.status(400).send('Not found');
    return;
  }
  response.status(200).send(photos);
});


var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
