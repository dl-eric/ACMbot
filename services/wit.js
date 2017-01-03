'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var Wit = require('node-wit').Wit
var request = require('request')
var Bot = require('../bot')


var firstEntityValue = function (entities, entity) {
    var val = entities && entities[entity] &&
        Array.isArray(entities[entity]) &&
        entities[entity].length > 0 &&
        entities[entity][0].value

    if (!val) {
        return null
    }
    return typeof val === 'object' ? val.value : val
}

var actions = {
    send({sessionId}, {text}) {
        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to
        console.log(Bot.sessions)
        const recipientId = Bot.sessions[sessionId].fbid;
        
        console.log(recipientId)

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
var getWit = function () {
    console.log('GRABBING WIT')
    return new Wit({
        accessToken: Config.WIT_TOKEN,
        actions
    })
}

module.exports = {
    getWit: getWit,
}

// BOT TESTING MODE
if (require.main === module) {
    console.log('Bot testing mode!')
    var client = getWit()
    client.interactive()
}

// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
