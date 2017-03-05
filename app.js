'use strict';

const express = require('express');
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

app.listen(app.get('port'), function() {
  console.log('listening at ', app.get('port'));
});

module.exports = app;
