// Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyBXtgpUWZYAKbnfQ4BUyBky8IJAv3Hn3Ts",
	authDomain: "test-for-group-project-ed523.firebaseapp.com",
	databaseURL:
		"https://test-for-group-project-ed523-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "test-for-group-project-ed523",
	storageBucket: "test-for-group-project-ed523.appspot.com",
	messagingSenderId: "977199787639",
	appId: "1:977199787639:web:c3f1fabf0efd669169a072",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// Get the user from local storage
var user = JSON.parse(localStorage.getItem("user"));

// Check if the user exists
if (user) {
    // Display welcome message using user details
    var welcomeMessage = document.createElement("p");
    welcomeMessage.textContent = "Welcome, " + user.email + "!";
    document.getElementById("form_content_inner_container").appendChild(welcomeMessage);
} else {
    // Redirect to login page if user is not found in local storage
    window.location = "login.html";
}

// Logout function
function logout() {
    localStorage.removeItem("user");
    auth.signOut().then(function() {
        // Redirect to login page
        window.location = "index.html";
    }).catch(function(error) {
        console.error("Logout Error:", error);
    });
}
