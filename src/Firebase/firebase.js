// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNv4KHIXBNa5Cbw0s1_EpU2IsH2RsThPw",
  authDomain: "react-chat-11602.firebaseapp.com",
  databaseURL: "https://react-chat-11602-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-chat-11602",
  storageBucket: "react-chat-11602.appspot.com",
  messagingSenderId: "219582341541",
  appId: "1:219582341541:web:f3ee404d2c76b8a6d3084c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, database };