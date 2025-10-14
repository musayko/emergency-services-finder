import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; 
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
// Import other pages like HomePage as you create them

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  return <h2>Welcome to your Dashboard! Your token is: {user?.token.substring(0, 20)}...</h2>;
};

// This component will protect routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  // 2. If we are still loading, show a simple loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // 3. Once loading is false, THEN check for the user
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            {!user ? (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            ) : (
              <li><button onClick={logout}>Logout</button></li>
            )}
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<h1>Home Page - Publicly Accessible</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;