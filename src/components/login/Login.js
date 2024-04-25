import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, database } from "../../Firebase/firebase";
import {
	signInWithRedirect,
	getRedirectResult,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useUser } from "../auth/UserContext";
import "./login.css";

const Login = () => {
	const { currentUser, setUser } = useUser(); // Destructure correctly
	const navigate = useNavigate();
	const [isRegistering, setIsRegistering] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [awaitingUsername, setAwaitingUsername] = useState(false);

	useEffect(() => {
		getRedirectResult(auth)
			.then((result) => {
				if (result?.user) {
					// Check if username exists in the database under the user's UID
					const usernameRef = ref(database, `usernames/${result.user.uid}`);
					get(usernameRef).then((snapshot) => {
						if (!snapshot.exists()) {
							setAwaitingUsername(true); // Prompt for username assignment
						} else {
							// Set user with username retrieved from the database
							setUser({
								uid: result.user.uid,
								email: result.user.email,
								displayName: snapshot.val(),
							});
							navigate("/");
						}
					});
				}
			})
			.catch((error) => {
				console.error("Error on redirect:", error);
			});
	}, [navigate, setUser]);

	const handleGoogleLogin = () => {
		signInWithRedirect(auth, provider);
	};

	const handleRegistration = async (event) => {
		event.preventDefault();
		if (isRegistering) {
			const isUnique = await checkUsernameUnique(username);
			if (!isUnique) {
				alert("Username is already taken, please choose another one.");
				return;
			}

			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// Store username under user's UID
					registerUsername(userCredential.user.uid, username).then(() => {
						setUser({
							uid: userCredential.user.uid,
							email: userCredential.user.email,
							displayName: username,
						});
						navigate("/");
					});
				})
				.catch((error) => {
					console.error("Registration failed:", error);
					alert("Registration failed: " + error.message);
				});
		} else {
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					setUser({
						uid: userCredential.user.uid,
						email: userCredential.user.email,
						displayName: userCredential.user.email, // Default to email if no username is set
					});
					navigate("/");
				})
				.catch((error) => {
					console.error("Login failed:", error);
					alert("Login failed: " + error.message);
				});
		}
	};

	const handleUsernameAssignment = async (event) => {
		event.preventDefault();
		if (!username.trim()) {
			alert("Please enter a valid username.");
			return;
		}
		const isUnique = await checkUsernameUnique(username);
		if (!isUnique) {
			alert("This username is already taken. Please choose another one.");
			return;
		}

		const currentUser = auth.currentUser;
		if (currentUser) {
			registerUsername(currentUser.uid, username)
				.then(() => {
					setUser({
						uid: currentUser.uid,
						email: currentUser.email,
						displayName: username,
					});
					navigate("/");
				})
				.catch((error) => {
					console.error("Error setting username:", error);
					alert("Error setting username: " + error.message);
				});
		}
	};

	const checkUsernameUnique = async (username) => {
		const usernameRef = ref(database, `usernames/${username}`);
		const snapshot = await get(usernameRef);
		return !snapshot.exists();
	};

	const registerUsername = (userId, username) => {
		const usernamesRef = ref(database, `usernames/${userId}`);
		return set(usernamesRef, username);
	};

	return (
		<div id="LogInDiv">
			<h1 class="DansH1">{isRegistering ? "Register" : "Log In"}</h1>
			{awaitingUsername ? (
				<form onSubmit={handleUsernameAssignment}>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Choose your username"
						required
					/>
					<button class="Dansbutton" type="submit">
						Set Username
					</button>
				</form>
			) : (
				<form onSubmit={handleRegistration}>
					{isRegistering && (
						<>
							<input
								class="DansInput"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Username"
								required
							/>
							<input
								class="DansInput"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								required
							/>
							<input
								class="DansInput"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								required
							/>
							<button class="Dansbutton" type="submit">
								Register
							</button>
							<button
								class="Dansbutton"
								onClick={() => setIsRegistering(!isRegistering)}
							>
								Switch to Login
							</button>
						</>
					)}
					{!isRegistering && (
						<>
							<input
								class="DansInput"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								required
							/>
							<input
								class="DansInput"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								required
							/>
							<button type="submit" class="Dansbutton">
								Login
							</button>
							<button class="Dansbutton" onClick={handleGoogleLogin}>
								Login with Google
							</button>
							<button
								class="Dansbutton"
								onClick={() => setIsRegistering(!isRegistering)}
							>
								Switch to Register
							</button>
						</>
					)}
				</form>
			)}
		</div>
	);
};

export default Login;
