// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqPrPkLwbuPArrC29onRL6iv_Yde7-tgc",
  authDomain: "pos-system-hey.firebaseapp.com",
  projectId: "pos-system-hey",
  storageBucket: "pos-system-hey.firebasestorage.app",
  messagingSenderId: "588716560386",
  appId: "1:588716560386:web:a87b582ba081a76b91971b",
  measurementId: "G-E8DRGGZQRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);