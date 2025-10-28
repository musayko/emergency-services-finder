// /client/src/App.jsx

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SeekerDashboardPage from './pages/SeekerDashboardPage';
import ProviderLoginPage from './pages/ProviderLoginPage';
import ProviderRegisterPage from './pages/ProviderRegisterPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import { Button } from '@/components/ui/button'; // <-- THE MISSING IMPORT

// This component will protect routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    // If not logged in, we redirect. We can make this smarter later if needed.
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <header className="p-4 border-b">
          <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              Emergency Finder
            </Link>
            
            {/* --- IMPROVED NAVIGATION --- */}
            <ul className="flex items-center gap-4">
              {!user ? (
                <>
                  <li>
                    <Link to="/provider/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      Are you a Provider?
                    </Link>
                  </li>
                  <li>
                    <Button asChild variant="ghost">
                      <Link to="/login">Login</Link>
                    </Button>
                  </li>
                  <li>
                    <Button asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <Button onClick={logout} variant="outline">
                    Logout
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main className="container mx-auto p-4 md:p-8">
          <Routes>
            {/* Seeker Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><SeekerDashboardPage /></ProtectedRoute>}
            />

            {/* Provider Routes */}
            <Route path="/provider/register" element={<ProviderRegisterPage />} />
            <Route path="/provider/login" element={<ProviderLoginPage />} />
            <Route
              path="/provider/dashboard"
              element={<ProtectedRoute><ProviderDashboardPage /></ProtectedRoute>}
            />
            
            {/* Public Homepage Route */}
            <Route path="/" element={
              <div className="text-center">
                <h1 className="text-4xl font-bold mt-16">Welcome to the 24/7 Emergency Finder</h1>
                <p className="text-muted-foreground mt-4">Your reliable partner in household emergencies.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;