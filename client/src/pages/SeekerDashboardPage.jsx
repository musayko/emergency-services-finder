import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import EmergencyReportForm from '../components/EmergencyReportForm';

const SeekerDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  // In a real app, you'd get the name from the user object/token
  const userName = user?.name || 'Seeker';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard_title', { name: userName })}</h1>
          <p className="text-muted-foreground mt-2">{t('dashboard_subtitle')}</p>
        </div>
        <EmergencyReportForm />
      </div>
    </div>
  );
};

export default SeekerDashboardPage;