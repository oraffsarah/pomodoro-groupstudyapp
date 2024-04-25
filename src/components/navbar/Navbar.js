import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firebase';
import { useUser } from '../auth/UserContext'; // Corrected import
import "./Navbar.css";

const Navbar = () => {
  const { currentUser } = useUser(); // Correctly using the imported hook
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Current user updated:', currentUser);
  }, [currentUser]); // Effect will run every time currentUser changes

  // Determine if the current location is the login page
  const isLoginRoute = location.pathname === '/login';

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
            <div className="user-info">
              <span className="user-name">{currentUser.displayName}</span> {/* Assuming 'displayName' is the correct property */}
              <button className="navbar-button" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          !isLoginRoute && (
            <button className="navbar-button" onClick={() => navigate('/login')}>Login</button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
