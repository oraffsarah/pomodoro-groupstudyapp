import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getRedirectResult
} from 'firebase/auth';
import { useUser } from '../auth/UserContext';
import { auth, database, provider } from '../../Firebase/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { ref, set, get } from 'firebase/database';
import { getDoc } from 'firebase/firestore';



const db = getFirestore(); 
const Login = () => {
  const { currentUser, setUser } = useUser(); // Destructure correctly
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [signInWithGoogle, setSignInWithGoogle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [awaitingUsername, setAwaitingUsername] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        const usernameRef = ref(database, `usernames/${result.user.uid}`);
        get(usernameRef).then((snapshot) => {
          if (!snapshot.exists()) {
            setAwaitingUsername(true); 
          } else {
            setUser({
              uid: result.user.uid,
              email: result.user.email,
              username: snapshot.val()
            });
            navigate('/');
          }
        });
      }
    }).catch((error) => {
      console.error('Error on redirect:', error);
    });
  }, [navigate, setUser]);

  const handleGoogleLogin = async() => {
    await signInWithPopup(auth, provider);
    setSignInWithGoogle(true);
    setAwaitingUsername(true);
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (!isRegistering) return;
  
    console.log('Calling checkUsernameUnique with username:', username);
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      alert('Username is already taken, please choose another one.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created with email and password:', email);
    
      const userData = {
        userId: userCredential.user.uid,
        username: username,
        email: email 
      };
    
      console.log('Attempting to save user data:', userData);
    
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        console.log('User data saved to Firestore');
        const snapshot = await getDoc(doc(db, 'users', userCredential.user.uid));
        console.log('Read back data:', snapshot.data());
      } catch (error) {
        console.error('Failed to save user data in Firestore:', error);
        alert('Failed to save user data: ' + error.message);
        return; 
      }
    
      try {
        await registerUsername(userCredential.user.uid, username);
        console.log('Username registered:', username);
      } catch (error) {
        console.error('Error setting username:', error);
        alert('Error setting username: ' + error.message);
        return; 
      }
    
      setUser({
        uid: userCredential.user.uid,
        email: email,
        username: username
      });
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    }
    
  };
  
  const handleUsernameAssignment = async (event) => {
    event.preventDefault();
    if (!username.trim()) {
      alert('Please enter a valid username.');
      return;
    }
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      alert('This username is already taken. Please choose another one.');
      return;
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      registerUsername(currentUser.uid, username).then(() => {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          username: username
        });
        navigate('/');
      }).catch((error) => {
        console.error('Error setting username:', error);
        alert('Error setting username: ' + error.message);
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
    return set(usernamesRef, username)
      .then(() => console.log(`Username ${username} registered for userId ${userId}`))
      .catch(error => {
        console.error('Failed to register username:', error);
        alert('Error setting username: ' + error.message);
      });
  };
  

  return (
    <div>
      {signInWithGoogle? <h1>Finalize Your Registration</h1> : <h1>{isRegistering ? 'Register' : 'Login'}</h1>}
      {awaitingUsername ? (
        <form onSubmit={handleUsernameAssignment}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose your username"
            required
          />
          <button type="submit">Set Username</button>
        </form>
      ) : (
        <form onSubmit={handleRegistration}>
          {isRegistering && (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit">Register</button>
            </>
          )}
          {!isRegistering && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit">Login</button>
              <button onClick={handleGoogleLogin}>Login with Google</button>
              <button onClick={() => setIsRegistering(!isRegistering)}>Switch to Register</button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default Login;