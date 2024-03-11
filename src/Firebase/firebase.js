// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSld3DwBbC7UVYfTjHi5Kz3xbfr8C9UhY",
  authDomain: "team-prodigy.firebaseapp.com",
  databaseURL: "https://team-prodigy-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "team-prodigy",
  storageBucket: "team-prodigy.appspot.com",
  messagingSenderId: "174908647641",
  appId: "1:174908647641:web:5557e4722291a4113336c8",
  measurementId: "G-HBC2VZKL50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, database };