import React from 'react';
import { Link } from 'react-router-dom';

const ProviderRegisterPage = () => {
  return (
    <div>
      <h2>Provider Registration</h2>
      <p>Registration form will be built here.</p>
      <Link to="/provider/login">Already have an account? Login</Link>
    </div>
  );
};

export default ProviderRegisterPage;