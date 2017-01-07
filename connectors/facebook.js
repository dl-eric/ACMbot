'use strict'
/********************
 * Required modules *
 ********************/
var request = require('request')
var Config = require('../config')

/**********************
 * Facebook functions *
 **********************/
// a beautiful product of peer programming
// SETUP A MESSAGE FOR THE FACEBOOK REQUEST
var newMessage = function (id, text, qckreplies) {
	var body = '' // declared as a string because of JSON.stringify
	if(qckreplies) { // qckreplies will be nil if the response should be a simple text
		var quick_replies = [] // quick_replies will end up being an array of json objects

		for(let i = 0; i < qckreplies.length; i++) {
			let myQuickReply = {
			'content_type': 'text',
			'title': qckreplies[i],
			'payload':'W0T' // look up the use for this key-value pair
			}

			quick_replies.push(myQuickReply)
		}
		
		body = JSON.stringify({
			recipient: {id},
			message: {text, quick_replies},
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
// exporting for use in other files
// getMessageEntry is used to determine whether
// a message contains attachments or not since
// the app currently does not support attachments
module.exports = {
	newMessage: newMessage,
	getMessageEntry: getMessageEntry,
}