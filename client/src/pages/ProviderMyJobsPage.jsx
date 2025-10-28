import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/context/AuthContext';
import jobService from '@/services/jobService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';

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

const ProviderMyJobsPage = () => {
  const { t } = useTranslation();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyJobs = async () => {
      if (user?.token) {
        try {
          const response = await jobService.getProviderJobs(user.token);
          setMyJobs(response.data);
        } catch (err) {
          setError(t('error_fetch_jobs'));
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyJobs();
  }, [user, t]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default'; // Green in the default theme
      case 'in_progress':
        return 'secondary'; // A lighter, secondary color
      case 'claimed':
      default:
        return 'outline'; // Simple outline
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">{t('loading_my_jobs')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProviderNav />
      <h1 className="text-3xl font-bold mb-6">{t('my_claimed_jobs_title')}</h1>
      {error && <p className="text-destructive mb-4">{error}</p>}
      {myJobs.length === 0 ? (
        <p>{t('no_claimed_jobs')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myJobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{job.ai_identified_problem}</CardTitle>
                  <Badge variant={getStatusVariant(job.status)} className="capitalize">
                    {job.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription className="mt-1">{t('job_category_label')}: {job.ai_identified_category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('job_claimed_label')}: {new Date(job.claimed_at).toLocaleString()}
                </p>
              </CardContent>
              <CardFooter>
                {/* In a real app, this would open a modal with job management options */}
                <Button variant="outline" className="w-full">{t('manage_job_button')}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderMyJobsPage;