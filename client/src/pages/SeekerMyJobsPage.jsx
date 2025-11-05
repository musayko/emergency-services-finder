import React, { useState, useEffect, useContext } from 'react';
import jobService from '../services/jobService';
import { AuthContext } from '../context/AuthContext';

const SeekerMyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !user.token) {
        setError('You must be logged in to see your jobs.');
        setLoading(false);
        return;
      }

      try {
        const response = await jobService.getSeekerJobs(user.token);
        setJobs(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Emergencies</h1>
      {jobs.length === 0 ? (
        <p>You have not submitted any emergency jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{job.ai_identified_problem}</h2>
              <p><strong>Category:</strong> {job.ai_identified_category}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Description:</strong> {job.user_description}</p>
              {job.image_url && (
                <img 
                  src={`http://localhost:5001/${job.image_url}`}
                  alt="Job"
                  className="mt-2 w-full h-auto rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerMyJobsPage;