// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDtsgX1DM03AADWoA9FHFdX9XDlV19Myn8',
  authDomain: 'teeth-aligners.firebaseapp.com',
  projectId: 'teeth-aligners',
  storageBucket: 'teeth-aligners.appspot.com',
  messagingSenderId: '240287978668',
  appId: '1:240287978668:web:a8f77a452019df7dfc3b09',
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
const now = firebase.firestore.Timestamp.now();
const storage = firebase.storage();
export { auth, db, now, storage, app };
console.log(app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(');
