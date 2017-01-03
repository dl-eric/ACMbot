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
