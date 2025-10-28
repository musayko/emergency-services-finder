// /client/src/pages/ProviderDashboardPage.jsx
// This version uses a simple custom modal instead of Radix Dialog

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import jobService from '@/services/jobService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ProviderDashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useContext(AuthContext);
  const [isClaiming, setIsClaiming] = useState(false); 

  useEffect(() => {
    const fetchJobs = async () => {
      if (user?.token) {
        try {
          setError('');
          setLoading(true);
          const response = await jobService.getOpenJobs(user.token);
          setJobs(response.data);
        } catch (err) {
          const errorMessage = err.response?.data?.error || 'Failed to fetch jobs.';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJobs();
  }, [user]);

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleClaimJob = async (jobId) => {
    if (!user?.token) {
      setError("You are not authenticated.");
      return;
    }

    setIsClaiming(true);
    setError('');

    try {
      const response = await jobService.claimJob(jobId, user.token);
      
      // If successful, update the UI
      console.log('Claimed job:', response.data.job);
      
      // Remove the claimed job from the list of available jobs
      setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
      
      // Close the modal
      closeModal();
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to claim the job.';
      setError(errorMessage);
      // We might want to show this error in the modal itself in a future version
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsClaiming(false);
    }
  };


  if (loading) {
    return <p>Loading available jobs...</p>;
  }

  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      
      {jobs.length === 0 ? (
        <p>No open jobs matching your category. Please check back later.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.ai_identified_problem}</CardTitle>
                <CardDescription>Category: {job.ai_identified_category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submitted at: {new Date(job.created_at).toLocaleString()}
                </p>
                <Button className="mt-4" onClick={() => openModal(job)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

{/* Custom Modal */}
{selectedJob && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center"
    onClick={closeModal}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/80" />
    
    {/* Modal Content */}
    <div 
      className="relative z-50 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={closeModal}
        disabled={isClaiming} // Disable close button while claiming
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity disabled:opacity-50"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>

      {/* --- THE EXTRA BUTTON THAT WAS HERE IS NOW DELETED --- */}

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{selectedJob.ai_identified_problem}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Category: {selectedJob.ai_identified_category} | Submitted: {new Date(selectedJob.created_at).toLocaleString()}
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-4">
        <div className="w-full">
          <img 
            src={`http://localhost:5001/${selectedJob.image_url}`}
            alt="Emergency" 
            className="rounded-md border max-w-full h-auto"
          />
        </div>
        <div>
          <h4 className="font-semibold mb-2">User's Description:</h4>
          <p className="text-sm text-muted-foreground">{selectedJob.user_description}</p>
        </div>
      </div>

      {/* --- CORRECTED FOOTER --- */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={closeModal} disabled={isClaiming}>
          Cancel
        </Button>
        <Button 
          onClick={() => handleClaimJob(selectedJob.id)}
          disabled={isClaiming}
        >
          {isClaiming ? 'Claiming...' : 'Claim Job'}
        </Button>
      </div>
    </div>
    </div>
  )}

</div>
  );
};

export default ProviderDashboardPage;