import React, { useState, useContext } from 'react'; // Import useContext
import { useNavigate } from 'react-router-dom'; // To redirect user
import { AuthContext } from '../context/AuthContext.jsx'; // Import our context
import authService from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await authService.login(email, password);
      if (response.data.token) {
        // Use the context's login function
        login(response.data.token);
        setMessage('Login Successful! Redirecting...');
        // Redirect to a protected dashboard after 1 second
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div>
      <h2>Seeker Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;