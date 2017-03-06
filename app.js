'use strict';

const express = require('express');
const msgutils = require('./msgutils');
const app = express();
app.set('port', process.env.PORT || 8080);

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
  console.log(data);
  if (data.object === 'page') {
    data.entry.forEach(function (entry) {
      let pageID = entry.id;
      let timeOfEvent = entry.time;
      entry.messaging.forEach(function(event) {
        if (event.message) {
	  msgutils.receivedMessage(event);
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
