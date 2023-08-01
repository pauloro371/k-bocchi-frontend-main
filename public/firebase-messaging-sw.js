// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBuVuRmAVjQVttgozamfi5ceKhYKFlTQFw",
    authDomain: "kbocchi-1254b.firebaseapp.com",
    projectId: "kbocchi-1254b",
    storageBucket: "kbocchi-1254b.appspot.com",
    messagingSenderId: "280897534781",
    appId: "1:280897534781:web:880b1ec78fc9ea2b3e6354",
    measurementId: "G-FPWW2DZD5S",
    storageBucket: "gs://kbocchi-1254b.appspot.com/",
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  
//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
});