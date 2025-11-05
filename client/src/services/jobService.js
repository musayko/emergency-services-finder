// /client/src/services/jobService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/jobs/';

// Function to submit a new emergency job
const submitJob = (description, image, token) => {
  // 1. Create a FormData object to hold the file and text
  const formData = new FormData();
  formData.append('description', description);
  formData.append('image', image); // The 'image' key must match what multer expects (.single('image'))

  // 2. Make the POST request with axios
  return axios.post(API_URL, formData, {
    headers: {
      // 3. Add the Authorization header to prove we are logged in
      Authorization: `Bearer ${token}`,
      // 4. Set the Content-Type for file uploads
      'Content-Type': 'multipart/form-data',
    },
  });
};
// Function to get open jobs for a provider
const getOpenJobs = (token) => {
  return axios.get(API_URL + 'open', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const claimJob = (jobId, token) => {
  return axios.put(
    `${API_URL}${jobId}/claim`,
    {}, // An empty body is needed for a PUT request, even if we send no data
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const getProviderJobs = (token) => {
  return axios.get(API_URL + 'my-jobs', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getSeekerJobs = (token) => {
  return axios.get(API_URL + 'my-jobs/seeker', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateJobStatus = (jobId, status, token) => {
  return axios.put(
    `${API_URL}${jobId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const jobService = {
  submitJob,
  getOpenJobs,
  claimJob,
  getProviderJobs,
  getSeekerJobs,
  updateJobStatus,
};

export default jobService;