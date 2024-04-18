// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNv4KHIXBNa5Cbw0s1_EpU2IsH2RsThPw",
  authDomain: "react-chat-11602.firebaseapp.com",
  projectId: "react-chat-11602",
  storageBucket: "react-chat-11602.appspot.com",
  messagingSenderId: "219582341541",
  appId: "1:219582341541:web:f3ee404d2c76b8a6d3084c"
};

function googleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log("User signed in: ", user.displayName);
      // You can store the user info like this:
      storeUserInfo(user.uid, user.displayName, user.email);
    }).catch((error) => {
      console.log("Authentication failed:", error);
    });
}

function storeUserInfo(userId, name, email) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email
  })
  .then(() => console.log("User information stored successfully."))
  .catch((error) => console.error("Failed to store user information", error));
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);