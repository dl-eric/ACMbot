'use strict'
/********************
 **required modules**
 ********************/
const Config = require('./config')
const FB = require('./connectors/facebook')
const Wit = require('node-wit').Wit
const index = require('./index.js')
// request is no longer needed

/******************
 **Wit.ai actions**
 ******************/
const actions = {
    send(request, response) {
        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to
		console.log(JSON.stringify(request));
        const recipientId = request.context._fbid_;
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
    // custom actions should go here
}

/*******************
 **Wit.ai services**
 *******************/
// SETUP THE WIT.AI SERVICE
const getWit = function () {
    console.log('GRABBING WIT')
    return new Wit({
        accessToken: Config.WIT_TOKEN,
        actions
    })
}
// exporting for use in index.js and potentially other files
module.exports = {
    getWit: getWit
}