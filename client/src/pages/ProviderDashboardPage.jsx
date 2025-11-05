import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/context/AuthContext';
import jobService from '@/services/jobService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import JobDetailsModal from '@/components/JobDetailsModal';
import { io } from 'socket.io-client';

const ProviderNav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const activeClass = "border-primary text-primary";
  const inactiveClass = "border-transparent text-muted-foreground hover:text-foreground hover:no-underline";

  return (
    <nav className="flex space-x-4 border-b mb-8">
      <Link
        to="/provider/dashboard"
        className={`pb-2 px-1 border-b-2 font-medium ${location.pathname === '/provider/dashboard' ? activeClass : inactiveClass}`}
      >
        {t('nav_available_jobs')}
      </Link>
      <Link
        to="/provider/my-jobs"
        className={`pb-2 px-1 border-b-2 font-medium ${location.pathname === '/provider/my-jobs' ? activeClass : inactiveClass}`}
      >
        {t('nav_my_jobs')}
      </Link>
    </nav>
  );
};

const ProviderDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          const errorMessage = err.response?.data?.error || t('error_fetch_jobs');
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJobs();

    const socket = io('http://localhost:5001');

    socket.on('newJob', (newJob) => {
      if (user?.category === newJob.ai_identified_category) {
        setJobs((prevJobs) => [newJob, ...prevJobs]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, t]);

  const handleClaimJob = async (jobId) => {
    if (!user?.token) {
      setError(t('error_not_authenticated'));
      return;
    }

    setIsClaiming(true);
    setError('');

    try {
      await jobService.claimJob(jobId, user.token);
      setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
      setSelectedJob(null);
      navigate('/provider/my-jobs');
    } catch (err) {
      const errorMessage = err.response?.data?.error || t('error_claim_job');
      setError(errorMessage);
      alert(`${t('error_alert_prefix')}: ${errorMessage}`);
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">{t('loading_jobs')}</div>;
  }

  return (
    <div className="container mx-auto p-4 no-underline">
      <ProviderNav />
      <h1 className="text-3xl font-bold mb-6 no-underline">
        {t('available_jobs_title_for')}{' '}
        {user?.business_name?.replace(/_/g, ' ')}
      </h1>
      {error && <p className="text-destructive mb-4">{error}</p>}
      {jobs.length === 0 ? (
        <p>{t('no_open_jobs')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{job.ai_identified_problem}</CardTitle>
                <CardDescription>{t('job_category_label')}: {job.ai_identified_category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('job_submitted_label')}: {new Date(job.created_at).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter>
                <JobDetailsModal
                  job={job}
                  onClaimJob={handleClaimJob}
                  isClaiming={isClaiming}
                >
                  <Button className="w-full">{t('view_details_button')}</Button>
                </JobDetailsModal>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboardPage;
