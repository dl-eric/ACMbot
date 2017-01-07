'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
app.use(bodyParser.urlencoded({extended: false})); // Process application/x-www-form-urlencoded
app.use(bodyParser.json()); // Process application/json
const Wit = require('node-wit').Wit
const FB = require('./connectors/facebook');
const Config = require('./config');
var sessions = {}

const actions = {
    send(request, response) {
        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to
        const recipientId = sessions[request.sessionId].fbid;

        if (recipientId) {
            // Yay, we found our recipient!
            // Let's forward our bot response to them.
            // We return a promise to let our bot know when we're done sending

            console.log(JSON.stringify(response));

            FB.newMessage(recipientId, response.text, response.quickreplies);
        } else {
            console.error('Oops! Couldn\'t find user for session:', request.sessionId);
            // Giving the wheel back to our bot
            return Promise.resolve()
        }
    },
    // You should implement your custom actions here
    // See https://wit.ai/docs/quickstart
}

const getWit = function () {
    console.log('GRABBING WIT')
    return new Wit({
        accessToken: Config.WIT_TOKEN,
        actions
    })
}
const wit = getWit();

const {interactive} = require('node-wit'); // this is here for testing in command line
// shameless copy pasta from bot.js
// this will make more sense why I copied it to this file later


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

		console.log('Wrong FB_VERIFYessio_TOKEN')
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
	  const sender = data.sender.id; // we need this for the parameter in the next line
	  const sessionId = findOrCreateSession(sender); // this is why I wanted to copy pasta the block from bot.js
	  const mssg = data.message.text; // from the webhook reference
	  const attchmnts = data.message.attachments; // from the webhook reference
	  
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
// SETUP THE WIT.AI SERVICE
// changed it to const

// if (require.main === module) {
//   console.log("Bot testing mode.");
//   const client = getWit();
//   interactive(client);
// }
// bot testing mode
// use this to test the bot in command line without deploying
// the command is WIT_TOKEN = {wit token} node index
// module.exports = { sessions: "sessions" };

// Spin up the server
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port')); // split up the listen and the log
console.log('running on port', app.get('port'));

// Index route
app.get('/', function (req, res) {
    res.send('This IS the page you are looking for!! Welcome and have a nice day :)')
});