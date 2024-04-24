import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './components/auth/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Room from './components/rooms/Room';
import { RoomManagerProvider } from './components/rooms/RoomManagerContext';
import Timer from './components/Timer.jsx';
import StatisticPage from './statisticsPage/statisticsPage.js';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/statistics" element={
            <ProtectedRoute>
              <StatisticPage />
            </ProtectedRoute>
          } />
          <Route path="/rooms/:roomId" element={
            <RoomManagerProvider>
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