import React, { useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firebase';
import { useUser } from '../auth/UserContext';  // Corrected import
import "./Navbar.css";

const Navbar = () => {
  const { currentUser } = useUser();  // Correctly using the imported hook
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current user updated:', currentUser);
  }, [currentUser]);  // Effect will run every time currentUser changes

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the homepage after logout
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        <Link to="/" className="navbar-link navbar-logo">Home</Link>
        {currentUser ? (
          <>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/statistics" className="navbar-link">Statistics</Link>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span> {/* Show username retrieved from context */}
              <button className="navbar-button" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <button className="navbar-button" onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
