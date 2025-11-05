import axios from 'axios';

// Set the base URL for our API. This will be the address of your backend server.
const API_URL = 'http://localhost:5001/api/seekers/';

// Register a new seeker
const register = (fullName, email, password) => {
  return axios.post(API_URL + 'register', {
    fullName,
    email,
    password,
  });
};

// Login a seeker
const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  });
};

const authService = {
  register,
  login,
};

export default authService;