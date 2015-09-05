var express = require('express');
var Twitter = require('twitter');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || 8080;
var app = express();
var clientUser;

clientUser = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var texts = [];

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

app.post('/', function (req, res) {
    if (!clientUser) return;

    clientUser.post('statuses/update', {status: req.query.msg}, function(err, tweet, response) {
        if (err) throw err;

        res.send('Tweet posted');
    });
});

var server = app.listen(port, ipaddress, function () {
    console.log('Example app listening at http://%s:%s', ipaddress, port);
});

