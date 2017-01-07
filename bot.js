'use strict'

const Config = require('./config') // these could all be consts
const FB = require('./connectors/facebook')
const Wit = require('node-wit').Wit
const index = require('./index.js')
// request is no longer needed

// WIT ACTIONS
const actions = {
    send(request, response) {
        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to
        const recipientId = request.recipient.id;
        if (recipientId) {
            // Yay, we found our recipient!
            // Let's forward our bot response to them.
            // We return a promise to let our bot know when we're done sending
			console.log(JSON.stringify(request));
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

// SETUP THE WIT.AI SERVICE
// changed it to const
const getWit = function () {
    console.log('GRABBING WIT')
    return new Wit({
        accessToken: Config.WIT_TOKEN,
        actions
    })
}

module.exports = {
    getWit: getWit
}