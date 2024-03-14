import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Import Dashboard component
import Dashboard from "./components/dashboard/Dashboard";
// Import any other pages or components you have
import HomePage from "./components/homepage/Homepage";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

function App() {
  return (
    <Router>
      <div>
        {/* Setup routes here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
