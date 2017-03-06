'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);

function sendTextMessage(recipientID, messageText) {
  let messageData = {
    recipient: {
      id: recipientID,
    },
    message: {
      text: messageText,
    }
  };
  console.log('sending message now');
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
