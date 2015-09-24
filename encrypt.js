#!/usr/bin/env node

var readline = require('readline');
var Tea = require('./xxtea.js');
var http = require('http');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Please wait while fetching the next nonce...');

http.get('http://localhost:8080/nonce', function(res) {
    var data = '';

    res.on('data', function(chunk) {
        data += chunk;
    });

    res.on('end', function() {
        console.log('nonce', data);
        askForDetails(null, data);
    });
});

function askForDetails(err, nonce) {
    rl.question("Please enter your password [password]: ", function (password) {
        rl.question("Please enter your message: ", function (message) {
            rl.close();

            var stringToEncrypt = '' + nonce + message;
            password = password || 'password';

            console.log('encrypted', encodeURIComponent(Tea.encrypt(stringToEncrypt, password)));
        });
    });
}
