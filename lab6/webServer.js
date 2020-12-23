"use strict";

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


app.get('/test/:p1', function (request, response) {
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        response.status(400).send('Bad param ' + param);
    }
});

app.get('/user/list', function (request, response) {
    User.find({}, (err, allUsers) => {
        let newUsers = allUsers;
        async.eachOf(allUsers, function(user, i, callback) {
            let {_id, first_name, last_name} = user;
            newUsers[i] = {_id, first_name, last_name};
            callback()
        }, (err) => {
            if (err) {
                console.log(err);
            } else {
                response.status(200).send(newUsers)
            }
        })
        
    });
});

app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    User.findOne({_id: id}, (err, user) => {
        if (err) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        console.log('oldUser: ' + user);
        let {_id, first_name, last_name, location, description, occupation} = user;
        let newUser = {_id, first_name, last_name, location, description, occupation};
        
        response.status(200).send(newUser);
    });
});

app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    Photo.find({user_id: id}, (err, photos) => {
        if (err) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        let newPhotos = JSON.parse(JSON.stringify(photos));
        async.eachOf(newPhotos, function(photo, i, callback) {
            delete photo.__v;
            async.eachOf(photo.comments, function(com, i, callback2) {
                let the_user = User.findOne({_id: com.user_id}, (err) => {
                    if (err) {
                        response.status(400).send('Not found');
                    }
                });
                the_user.then((user) => {
                    let {_id, first_name, last_name} = user;
                    photo.comments[i] = {
                        comment: com.comment,
                        date_time: com.date_time,
                        _id: com._id,
                        user: {
                            _id: _id,
                            first_name: first_name,
                            last_name: last_name
                        }
                    }
                    callback2();
                });
            }, (err) => {
                if (err) {
                    console.log('error occured');
                } 
                newPhotos[i] = photo;
                callback();
            })
        }, function (err) {
            if (!err) {
                response.status(200).send(newPhotos);
            }
        });
    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


