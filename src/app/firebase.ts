// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqgmBea77QpHDFNdANDziwGEiqMXoj31g",
  authDomain: "fds-crud-cf6ef.firebaseapp.com",
  projectId: "fds-crud-cf6ef",
  storageBucket: "fds-crud-cf6ef.firebasestorage.app",
  messagingSenderId: "664584991443",
  appId: "1:664584991443:web:409fd694b0d0dada225a26",
  measurementId: "G-EQFPNQ6SKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)