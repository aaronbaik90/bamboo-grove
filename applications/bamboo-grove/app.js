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
