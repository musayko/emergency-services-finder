import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext.jsx';
import authService from '../services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
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
      const response = await authService.login(email, password);
      if (response.data.token) {
        login(response.data.token);
        navigate('/dashboard');
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
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex lg:items-center lg:justify-center bg-primary text-primary-foreground p-8">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-extrabold">{t('login_welcome_title')}</h1>
          <p className="mt-4 text-xl">{t('login_welcome_subtitle')}</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">{t('login_title')}</CardTitle>
            <CardDescription>{t('login_subtitle')}</CardDescription>
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
                <div className="flex items-center">
                  <Label htmlFor="password">{t('password')}</Label>
                </div>
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
            <div className="mt-4 text-center text-sm">
              {t('no_account')}{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                {t('sign_up')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
