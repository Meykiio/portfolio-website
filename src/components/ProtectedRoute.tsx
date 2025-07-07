
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    if (adminOnly && user && !loading) {
      setCheckingAdmin(true);
      const checkAdminStatus = async () => {
        try {
          console.log('Checking admin status for user:', user.id);
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            console.log('User role:', data?.role);
            setIsAdmin(data?.role === 'admin');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setCheckingAdmin(false);
        }
      };

      checkAdminStatus();
    } else if (!adminOnly) {
      setIsAdmin(true); // Non-admin routes don't need admin check
    }
  }, [user, adminOnly, loading]);

  // Show loading spinner while checking auth or admin status
  if (loading || (adminOnly && checkingAdmin)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if admin access required but user is not admin
  if (adminOnly && !isAdmin) {
    console.log('User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
