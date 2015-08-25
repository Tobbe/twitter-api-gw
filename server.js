var express = require('express');
var fs      = require('fs');
var OAuth2  = require('oauth').OAuth2;
var Twitter = require('twitter');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || 8080;

if (typeof ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_*_IP var, using 127.0.0.1');
    ipaddress = "127.0.0.1";
}

var app = express();

app.get('/', function (req, res) {
    var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
    var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;

    var https = require('https');

    var oauth2 = new OAuth2(
        twitterConsumerKey,
        twitterConsumerSecret,
        'https://api.twitter.com/',
        null,
        'oauth2/token',
        null);

    var access_options = { 'grant_type': 'client_credentials' };
    oauth2.getOAuthAccessToken('', access_options, function (err, access_token) {
        console.log(access_token); //string that we can use to authenticate request

        var client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            bearer_token: access_token
        });

        client.get('search/tweets', {q: 'to:SH_IoT'}, function(error, tweets, response) {
            if (err) throw err;

            var texts = [];
            tweets.statuses.forEach(function (status) {
                texts.push(status.text);
            });
            console.log(texts);
            res.json(texts);
        });
    });
});

var server = app.listen(port, ipaddress, function () {
    console.log('Example app listening at http://%s:%s', ipaddress, port);
});

