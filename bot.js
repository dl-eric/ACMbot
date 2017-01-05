'use strict'

const Config = require('./config') // these could all be consts
const FB = require('./connectors/facebook')
const Wit = require('node-wit').Wit
// request is no longer needed
const {interactive} = require('node-wit'); // this is here for testing in command line

// WIT ACTIONS
const actions = {
    send({sessionId}, {text}) {
		if (require.main === module) {
			console.log(text);
		      return;
		    }
        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to
        const recipientId = sessions[sessionId].fbid;

        if (recipientId) {
            // Yay, we found our recipient!
            // Let's forward our bot response to her.
            // We return a promise to let our bot know when we're done sending

            FB.newMessage(recipientId, text);
        } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
            // Giving the wheel back to our bot
            return Promise.resolve()
        }
    },
    // You should implement your custom actions here
    // See https://wit.ai/docs/quickstart
}

// SETUP THE WIT.AI SERVICE
// changed it to const
const getWit = function () {
    console.log('GRABBING WIT')
    return new Wit({
        accessToken: Config.WIT_TOKEN,
        actions
    })
}

var myWit = getWit()


// bot testing mode
// use this to test the bot in command line without deploying
// the command is WIT_TOKEN = {wit token} node bot
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  interactive(client);
}