'use strict'

var request = require('request')
var Config = require('../config')

// SETUP A MESSAGE FOR THE FACEBOOK REQUEST
var newMessage = function (id, text, qckreplies) {
	var body = ''
	if(qckreplies) {
		var quickreplies = []

		for(let i = 0; i < quickreplies.length; i++) {
			let myQuickReply = {
			'content_type': 'text',
			'title': qckreplies[i],
			'payload':'W0T'
			}

			quickreplies.push(myQuickReply)
		}
		
		body = JSON.stringify({
			recipient: {id},
			message: {text, quickreplies},
		});
	} else {
		body = JSON.stringify({
			recipient: {id},
			message: {text},
		});
	}
	
	console.log(body);

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

// PARSE A FACEBOOK MESSAGE to get user, message body, or attachment
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
var getMessageEntry = function (body) {
	var val = body.object === 'page' &&
						body.entry &&
						Array.isArray(body.entry) &&
						body.entry.length > 0 &&
						body.entry[0] &&
						body.entry[0].messaging &&
						Array.isArray(body.entry[0].messaging) &&
						body.entry[0].messaging.length > 0 &&
						body.entry[0].messaging[0]
	return val || null
}

module.exports = {
	newMessage: newMessage,
	getMessageEntry: getMessageEntry,
}