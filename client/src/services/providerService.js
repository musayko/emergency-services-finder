// /client/src/services/providerService.js

import axios from 'axios';

const API_URL = 'http://localhost:5001/api/providers/';

// Register a new provider
const register = (businessName, email, password, serviceCategory) => {
  return axios.post(API_URL + 'register', {
    business_name: businessName,
    email,
    password,
    service_category: serviceCategory,
  });
};

// Login a provider
const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  });
};

const providerService = {
  register,
  login,
};

export default providerService;