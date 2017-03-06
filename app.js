'use strict';

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
const ACCESS_TOKEN = 'EAACjktyne1cBACDlObT3uR1WUZAOqpZCv5TdaiTVYDndxs5Oh3THNYD7Lq5dZCYKNKcyYfc2sOGTRt0zjRgVZCZBz6KypZBsrpUzZAa0Igv4ZA8RCyURAXRq5sWoY3JiyGeJ9d92f0C3kLyAkVIRa8WYrzIZC8d6z1CKpWVcAu7XLUQZDZD';
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);

function postToPage(messageText) {
  request({
    uri: 'https://graph.facebook.com/v2.6/427109120962595/feed',
    method: 'POST',
    qs: {access_token: ACCESS_TOKEN,
         message: messageText},
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Contents Posted');
    } else {
      console.error('Unable to post message.');
      console.error(response, error);
    }
  });
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: ACCESS_TOKEN},
    method: 'POST',
    json: messageData,
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let recipientId = body.recipient_id;
      let messageId = body.message_id;
    } else {
      console.error('Unable to send message.');
      console.error(response, error);
    }
  });
};

function sendTextMessage(recipientID, messageText) {
  let messageData = {
    recipient: {
      id: recipientID,
    },
    message: {
      text: messageText,
    }
  };
  postToPage(messageText);
  callSendAPI(messageData);
};

function receivedMessage (event) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;
  let message = event.message;

  let messageId = message.mid;
  let messageText = message.text;
  let messageAttachments = message.attachments;
  if (messageText) {
    sendTextMessage(senderID, messageText);
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
};


/********** GET, POST Request Handlers ***************/
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'bamboo-grove') {
    console.log('Validating Webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation');
    res.sendStatus(403);
  } 
});

app.post('/webhook', function (req, res) {
  let data = req.body;
  if (data.object === 'page') {
    data.entry.forEach(function (entry) {
      let pageID = entry.id;
      let timeOfEvent = entry.time;
      entry.messaging.forEach(function(event) {
        if (event.message) {
	  receivedMessage(event);
	} else {
	  console.log('Webhook received unknown event:', event);
	}
      });
    });
    res.sendStatus(200);
  }
});

app.listen(app.get('port'), function() {
  console.log('listening at ', app.get('port'));
});

module.exports = app;
