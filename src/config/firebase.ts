// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_WEB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_PROJECT_NUMBER,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const app = firebase.app();
const auth = firebase.auth();
const firebaseAuth = getAuth(app);
const db = firebase.firestore();
const now = firebase.firestore.Timestamp.now();
const storage = firebase.storage();
export {
  auth,
  firebaseAuth,
  signInWithEmailAndPassword,
  signOut,
  db,
  now,
  storage,
  app,
};
console.log(app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(');
