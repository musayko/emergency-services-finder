import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/context/AuthContext';
import providerService from '@/services/providerService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProviderLoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await providerService.login(email, password);
      if (response.data.token) {
        login(response.data.token);
        navigate('/provider/dashboard');
      }
    } catch (err) {
      const resMessage =
        (err.response && err.response.data && err.response.data.error) ||
        err.message ||
        err.toString();
      setError(resMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t('provider_login_title')}</CardTitle>
          <CardDescription>{t('provider_login_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-card"
              />
            </div>
            {error && <p className="text-sm text-center text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {t('login_button')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            {t('no_provider_account')}{' '}
            <Link to="/provider/register" className="font-semibold text-primary hover:underline">
              {t('sign_up_now')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProviderLoginPage;
