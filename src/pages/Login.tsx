
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Suspense } from 'react';
import { MetaBalls, Silk } from '@/components/LazyComponents';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect logic based on user role
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User logged in, checking admin status:', isAdmin);
      if (isAdmin) {
        console.log('Redirecting admin to /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('Redirecting regular user to /');
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to sign in');
        toast({
          title: "Login Failed",
          description: error.message || 'Failed to sign in',
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <Suspense fallback={null}>
            <MetaBalls />
            <Silk />
          </Suspense>
        </div>
        <div className="text-electric-cyan">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <MetaBalls />
          <Silk />
        </Suspense>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md relative z-10 glass-effect border-electric-cyan/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-space-grotesk text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-dark/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-cyan"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-dark/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-cyan"
                disabled={loading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-electric-cyan text-dark hover:bg-electric-cyan/90 font-medium"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
