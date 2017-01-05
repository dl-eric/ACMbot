'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const FB = require('./connectors/facebook'); // make it a const
const Bot = require('./bot'); // making it a const
const Config = require('./config'); // was there a reason these were vars

const wit = Bot.getWit(); // since you have this function anyway in the Bot file might as well use it


// shameless copy pasta from bot.js
// this will make more sense why I copied it to this file later
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId;

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}


// Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    }

    res.send('Error, wrong token. Go away.')
	res.sendStatus(400); // this is where HTTP bad request 400 should be flagged
});

// API Endpoint
// Messenger payload is here.
app.post('/webhook/', (req, res) => {
  const data = FB.getMessageEntry(req.body) // added a call to FB.getMessageEntry instead of simply calling req.body
  if(data && data.message) {
  	  // this block should only run when we get a message
	  // all of these are from https://developers.facebook.com/docs/messenger-platform/webhook-reference/message link
	  // that was in the facebook.js file
	  const sender = messaging.sender.id; // we need this for the parameter in the next line
	  const sessionId = findOrCreateSession(sender); // this is why I wanted to copy pasta the block from bot.js
	  const mssg = messaging.message.text; // from the webhook reference
	  const attchmnts = messaging.message.attachments; // from the webhook reference
	  
	  if (attchmnts) { // when we declare attchmnts if it's there then it will trigger the if statement bc it's not nil
		  FB.newMessage(sender, "What's that?"); // hey look! this is your code!
	  } else if(mssg) {
		  // copy pasted from bot.js added some semi-colons
		  // my understanding is wit.runActions() takes care of replying as well
		  wit.runActions(
			sessionId, // the user's current session by id
			mssg,  // the user's message
			sessions[sessionId].context, // the user's session state
			function (error, context) { // callback
				if (error) {
					console.log('oops!', error);
				} else {
					// Wit.ai ran all the actions
				    // Now it needs more messages
				    console.log('Waiting for further messages');

				    // Based on the session state, you might want to reset the session
				    // Example:
				    // if (context['done']) {
				    // 	delete sessions[sessionId]
				    // }

				    // Updating the user's current session state
                    sessions[sessionId].context = context;
				}
			});
	  } else {
			console.log('received event', JSON.stringify(event)); // kept it here
		}
	}
  res.sendStatus(200);
});

// rearranged all the server related commands to down here
// Spin up the server
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false})); // Process application/x-www-form-urlencoded
app.use(bodyParser.json()); // Process application/json
app.listen(app.get('port')); // split up the listen and the log
console.log('running on port', app.get('port'));

// Index route
app.get('/', function (req, res) {
    res.send('This IS the page you are looking for!! Welcome and have a nice day :)') // changed the server message
});