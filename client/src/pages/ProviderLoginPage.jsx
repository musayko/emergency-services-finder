import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import providerService from '@/services/providerService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const ProviderLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await providerService.login(email, password);
      if (response.data.token) {
        login(response.data.token); // Use the same global login function
        navigate('/provider/dashboard'); // Redirect to provider dashboard
      }
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.error) || error.message;
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Provider Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {message && <p className="text-destructive text-sm mt-2">{message}</p>}
          <p className="text-sm text-muted-foreground mt-4">
            Don't have an account? <Link to="/provider/register" className="underline">Register here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProviderLoginPage;