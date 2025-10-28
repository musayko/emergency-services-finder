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
import { Button } from '@/components/ui/button'; 
import ProviderMyJobsPage from './pages/ProviderMyJobsPage';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <header className="p-4 border-b">
          <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              {t('app_title')}
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('en')}>EN</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('ee')}>EE</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('ru')}>RU</Button>
            </div>

            {/* --- IMPROVED NAVIGATION --- */}
            <ul className="flex items-center gap-4">
              {!user ? (
                <>
                  <li>
                    <Link to="/provider/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      {t('are_you_a_provider')}
                    </Link>
                  </li>
                  <li>
                    <Button asChild variant="ghost">
                      <Link to="/login">{t('login')}</Link>
                    </Button>
                  </li>
                  <li>
                    <Button asChild>
                      <Link to="/register">{t('register')}</Link>
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <Button onClick={logout} variant="outline">
                    {t('logout')}
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
            <Route
              path="/provider/my-jobs"
              element={<ProtectedRoute><ProviderMyJobsPage /></ProtectedRoute>}
            />
            
            {/* Public Homepage Route */}
            <Route path="/" element={
              <div className="text-center">
                <h1 className="text-4xl font-bold mt-16">{t('welcome_message')}</h1>
                <p className="text-muted-foreground mt-4">{t('welcome_subtitle')}</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;