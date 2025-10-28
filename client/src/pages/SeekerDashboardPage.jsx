// /client/src/pages/SeekerDashboardPage.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// We will create this component next
import EmergencyReportForm from '../components/EmergencyReportForm'; 

const SeekerDashboardPage = () => {
  const { user } = useContext(AuthContext);

  // We can decode the token later to get the actual name
  const userName = user?.name || 'Seeker';

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <p>Please describe your emergency and upload a photo of the issue.</p>
      <hr />
      <EmergencyReportForm />
    </div>
  );
};

export default SeekerDashboardPage;