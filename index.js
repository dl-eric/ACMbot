'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

var FB = require('./connectors/facebook');
var Bot = require('./bot');
var Config = require('./config');

const app = express();
app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('This is not the page you\'re looking for...')
});

// Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    }

    res.send('Error, wrong token. Go away.')
});

// API Endpoint
// Messenger payload is here.
app.post('/webhook/', (req, res) => {
  const data = req.body;

  console.log('We got something...');
  
  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && !event.message.is_echo) {
          // Yay! We got a new message!

          if (event.message.attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            FB.newMessage(event.sender.id, "What's that?");
          } else if (event.message.text) {
            // We received a text message
            console.log('We received something!');
            // Let's forward the message to the Wit.ai Bot Engine
            // This will run all actions until our bot has nothing left to do
            Bot.read(event.sender.id, event.message.text, function (sender, reply) {
                FB.newMessage(event.sender.id, reply)   
            })
          }
        } else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
  }
  
  res.sendStatus(200);
});

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});