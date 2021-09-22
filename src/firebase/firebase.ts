// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBCiOtNfh_CVvFQfABRsGCC-CTU-27zHh8',
  authDomain: 'blackjack-io-80919.firebaseapp.com',
  projectId: 'blackjack-io-80919',
  storageBucket: 'blackjack-io-80919.appspot.com',
  messagingSenderId: '104902623011',
  appId: '1:104902623011:web:e7ae6fb62d075c769c1696',
  measurementId: 'G-6EPD0CZ4VJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
