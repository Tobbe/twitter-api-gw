var express = require('express');
var Twitter = require('twitter');
var Tea = require('./xxtea.js');
var nonce = require('nonce')();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || 8080;
var password = process.env.ENCRYPTION_PASSWORD || 'password';
var app = express();
var clientUser;

clientUser = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var texts = [];
var nextNonce = nonce();

clientUser.stream('statuses/filter', {track: '@SH_IoT'}, function(stream) {
    stream.on('data', function(tweet) {
        texts.push(tweet.text);
    });

    stream.on('error', function(error) {
        throw error;
    });
});

app.get('/', function (req, res) {
    if (!clientUser) return;

    res.json(texts);
});

app.get('/nonce', function (req, res) {
    res.send('' + nextNonce);
});

app.post('/', function (req, res) {
    if (!clientUser) return;

    var encryptedMessage = req.query.msg;
    var msg = Tea.decrypt(encryptedMessage, password);
    if (msg.indexOf(nextNonce) === 0) {
        msg = msg.substr(('' + nextNonce).length);
        clientUser.post('statuses/update', {status: msg}, function(err, tweet, response) {
            if (err) throw err;

            nextNonce = nonce();
            res.send('Tweet posted: ' + msg);
        });
    } else {
        res.send('Wrong password');
    }
});

var server = app.listen(port, ipaddress, function () {
    console.log('Example app listening at http://%s:%s', ipaddress, port);
});

