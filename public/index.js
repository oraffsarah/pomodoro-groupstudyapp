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

// Register function
function register() {
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;

	// Validate input fields
	if (validate_email(email) == false || validate_password(password) == false) {
		alert("Email or Password invalid");
		return;
	}

	// Move on with Auth
	auth
		.createUserWithEmailAndPassword(email, password)
		.then(function () {
			// Declare user variable
			var user = auth.currentUser;

			// Add this user to Firebase Database
			var database_ref = database.ref();

			// Create User data
			var user_data = {
				email: email,
				last_login: Date.now(),
			};

			// Push to Firebase Database
			database_ref.child("users/" + user.uid).set(user_data);

			alert("User Created");
		})
		.catch(function (error) {
			var error_code = error.code;
			var error_message = error.message;

			alert(error_message);
		});
}

// Login function
function login() {
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;

	// Validate input fields
	if (validate_email(email) == false || validate_password(password) == false) {
		alert("Email or Password invalid");
		return;
	}

	auth
		.signInWithEmailAndPassword(email, password)
		.then(function () {
			// Declare user variable
			var user = auth.currentUser;

			// Add this user to Firebase Database
			var database_ref = database.ref();

			// Create User data
			var user_data = {
				last_login: Date.now(),
			};

			// Push to Firebase Database
			database_ref.child("users/" + user.uid).update(user_data);

			alert("User logged in");
			// navigate to home
			window.location = "home.html";
			// save user data in local storage
			localStorage.setItem("user", JSON.stringify(user));
		})
		.catch(function (error) {
			var error_code = error.code;
			var error_message = error.message;

			alert(error_message);
		});
}

// Validate Functions
function validate_email(email) {
	expression = /^[^@]+@\w+(\.\w+)+\w$/;
	if (expression.test(email) == true) {
		return true;
	} else {
		return false;
	}
}

function validate_password(password) {
	// Firebase only accepts lengths greater than 6
	if (password < 6) {
		return false;
	} else {
		return true;
	}
}
