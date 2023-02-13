var admin = require('firebase-admin');
var serviceAccount = require('./test-3709a-firebase-adminsdk-6jxvx-d287f3242f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://test-3709a-default-rtdb.firebaseio.com'
});

// TODO remake this file !!!

const sendMessageToUserDevice = (title, body, token, jobId) => {
  const message = {
    token: token,
    data: {jobId},
    notification: {
      body: body,//'This is an FCM notification that displays an image!',
      title: title,//'FCM Notification',
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1,
        },
      },
      fcm_options: {
        image: 'image-url', // can send image
      },
    },
    android: {
      notification: {
        image: 'image-url', // can send image
      },
    },
  };
  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};

module.exports = { sendMessageToUserDevice };
