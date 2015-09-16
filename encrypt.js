#!/usr/bin/env node

var readline = require('readline');
var Tea = require('./xxtea.js');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please enter the nonce: ", function (nonce) {
    rl.question("Please enter your password [password]: ", function (password) {
        rl.question("Please enter your message: ", function (message) {
            rl.close();

            var stringToEncrypt = '' + nonce + message;
            password = password || 'password';

            console.log('encrypted', encodeURIComponent(Tea.encrypt(stringToEncrypt, password)));
        });
    });
});
