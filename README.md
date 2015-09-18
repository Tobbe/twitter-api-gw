Twitter API GW
==============

HTTP gateway to the Twitter API.

I use it to post and read tweets from an
[Espruino Pico](http://www.espruino.com/Pico), which does not have the CPU
power, or specialized hardware, to do HTTPS. HTTPS is required to work with
the twitter API.

Usage
-----

### Setup

Set the following environment variables:

    TWITTER_CONSUMER_KEY
    TWITTER_CONSUMER_SECRET
    TWITTER_ACCESS_TOKEN_KEY
    TWITTER_ACCESS_TOKEN_SECRET

    ENCRYPTION_PASSWORD

### Sending a tweet

To send a tweet you POST to http://<app URL>/?msg=<encrypted message> where
<encrypted message> is the string you want to tweet, prepended by a valid
nonce and finally encrypted with your configured password.

The nonce to use is retrieved by sending a GET to http://<app URL>/nonce

The password to use is configured by setting the environment variable
`process.env.ENCRYPTION_PASSWORD`.

### Reading tweets

Reading is super simple. Just GET http://<app URL>/ and you'll get a JSON
list of all messages since the application was started.


Selecting a Node version to install/use
---------------------------------------

To select the version of Node.js that you want to run, just edit or add
a version to the .openshift/markers/NODEJS_VERSION file.

    Example: To install Node.js version 0.12.5, you can run:
       $ echo 0.12.5 >> .openshift/markers/NODEJS_VERSION

    Or alternatively, edit the ```.openshift/markers/NODEJS_VERSION``` file
    in your favorite editor aka vim ;^)

Commit your changes, and push them to OpenShift

    git commit . -m 'use Node version 0.12.42'
    git push

