// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, update } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAvsJwuvpkkEIjA9pujvOvywQ9wDOM8cKI',
  authDomain: 'asif-42d47.firebaseapp.com',
  projectId: 'asif-42d47',
  storageBucket: 'asif-42d47.firebasestorage.app',
  messagingSenderId: '266492954848',
  appId: '1:266492954848:web:19042e1a2436eb290fa885',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database, ref, set, update, app }
