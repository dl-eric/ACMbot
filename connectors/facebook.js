'use strict'

var request = require('request')
var Config = require('../config')

// POST to Facebook
var newMessage = function (id, text) {
	const body = JSON.stringify({
    	recipient: {id},
    	message: {text},
  	});
  
  	const qs = 'access_token=' + Config.FB_PAGE_TOKEN;
  	return fetch('https://graph.facebook.com/v2.6/me/messages?' + qs, {
    	method: 'POST',
    	headers: {'Content-Type': 'application/json'},
    	body,
  	})
  	.then(rsp => rsp.json())
  	.then(json => {
    	if (json.error && json.error.message) {
      		throw new Error(json.error.message);
		}
    	
		return json;
  	});
}

module.exports = {
	newMessage: newMessage,
}