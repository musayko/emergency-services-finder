import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
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

const RegisterPage = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(fullName, email, password);
      setSuccess(t('registration_successful_redirect'));
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const resMessage =
        (err.response && err.response.data && err.response.data.error) ||
        err.message ||
        err.toString();
      setError(resMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t('register_title')}</CardTitle>
          <CardDescription>{t('register_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">{t('full_name')}</Label>
              <Input
                id="full-name"
                type="text"
                placeholder={t('full_name_placeholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-card"
              />
            </div>
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
            {success && <p className="text-sm text-center text-primary">{success}</p>}
            <Button type="submit" className="w-full">
              {t('create_account')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            {t('already_have_account')}{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              {t('sign_in')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
