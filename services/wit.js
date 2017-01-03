'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var Wit = require('node-wit').Wit
var request = require('request')


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

// GET WEATHER FROM API
var getWeather = function (location) {
    return new Promise(function (resolve, reject) {
        var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + location + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var jsonData = JSON.parse(body)
                var forecast = jsonData.query.results.channel.item.forecast[0].text
                console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
                return forecast
            }
        })
    })
}

// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// LIST OF ALL PICS
var allPics = {
    corgis: [
        'http://i.imgur.com/uYyICl0.jpeg',
        'http://i.imgur.com/useIJl6.jpeg',
        'http://i.imgur.com/LD242xr.jpeg',
        'http://i.imgur.com/Q7vn2vS.jpeg',
        'http://i.imgur.com/ZTmF9jm.jpeg',
        'http://i.imgur.com/jJlWH6x.jpeg',
        'http://i.imgur.com/ZYUakqg.jpeg',
        'http://i.imgur.com/RxoU9o9.jpeg',
    ],
    racoons: [
        'http://i.imgur.com/zCC3npm.jpeg',
        'http://i.imgur.com/OvxavBY.jpeg',
        'http://i.imgur.com/Z6oAGRu.jpeg',
        'http://i.imgur.com/uAlg8Hl.jpeg',
        'http://i.imgur.com/q0O0xYm.jpeg',
        'http://i.imgur.com/BrhxR5a.jpeg',
        'http://i.imgur.com/05hlAWU.jpeg',
        'http://i.imgur.com/HAeMnSq.jpeg',
    ],
    default: [
        'http://blog.uprinting.com/wp-content/uploads/2011/09/Cute-Baby-Pictures-29.jpg',
    ],
};