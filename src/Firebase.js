// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNv4KHIXBNa5Cbw0s1_EpU2IsH2RsThPw",
  authDomain: "react-chat-11602.firebaseapp.com",
  databaseURL: "https://react-chat-11602-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-chat-11602",
  storageBucket: "react-chat-11602.appspot.com",
  messagingSenderId: "219582341541",
  appId: "1:219582341541:web:24f5da00e7aefaf0d3084c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);