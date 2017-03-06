module.exports = {

sendTextMessage: function (recipientID, messageText) {
  let messageData = {
    recipient: {
      id: recipientID,
    },
    message: {
      text: messageText,
    }
  };
  console.log('sending message now');
},

receivedMessage: function (event) {
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
}

};

