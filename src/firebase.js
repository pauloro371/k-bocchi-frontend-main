// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
const provider = new GoogleAuthProvider();
export async function signInWithGoogle() {
  signInWithRedirect(auth, provider);
}


export default app;
