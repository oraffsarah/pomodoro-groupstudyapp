import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Home from './components/homepage/Homepage';
import Login from './components/login/Login';
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './components/auth/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Room from './components/rooms/Room';
import { RoomManagerProvider } from './components/rooms/RoomManagerContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/rooms/:roomId" element={
            <RoomManagerProvider> {/* Ensure provider wraps the Room component */}
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            </RoomManagerProvider>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
