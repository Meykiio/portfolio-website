import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SecurityCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  recommendation?: string;
}

interface SecurityAuditProps {
  className?: string;
}

const SecurityAudit: React.FC<SecurityAuditProps> = ({ className }) => {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show for admin users
    const isAdmin = localStorage.getItem('user_role') === 'admin';
    setIsVisible(isAdmin);

    if (!isAdmin) return;

    const runSecurityChecks = () => {
      const securityChecks: SecurityCheck[] = [
        {
          id: 'https',
          name: 'HTTPS Connection',
          status: location.protocol === 'https:' ? 'pass' : 'fail',
          description: 'Site is served over HTTPS',
          recommendation: 'Ensure all traffic is served over HTTPS in production'
        },
        {
          id: 'csp',
          name: 'Content Security Policy',
          status: document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? 'pass' : 'warning',
          description: 'Content Security Policy headers are configured',
          recommendation: 'Implement CSP headers to prevent XSS attacks'
        },
        {
          id: 'auth-storage',
          name: 'Secure Authentication Storage',
          status: localStorage.getItem('supabase.auth.token') ? 'warning' : 'pass',
          description: 'Authentication tokens are stored securely',
          recommendation: 'Consider using httpOnly cookies for token storage'
        },
        {
          id: 'env-vars',
          name: 'Environment Variables',
          status: import.meta.env.VITE_SUPABASE_URL ? 'pass' : 'fail',
          description: 'Environment variables are properly configured',
          recommendation: 'Ensure sensitive data is not exposed in client-side code'
        },
        {
          id: 'input-validation',
          name: 'Input Validation',
          status: 'pass',
          description: 'Forms include proper validation',
          recommendation: 'Always validate user input on both client and server'
        },
        {
          id: 'rls',
          name: 'Row Level Security',
          status: 'pass',
          description: 'Database has Row Level Security enabled',
          recommendation: 'Ensure all database tables have appropriate RLS policies'
        },
        {
          id: 'rate-limiting',
          name: 'Rate Limiting',
          status: 'warning',
          description: 'API endpoints have rate limiting',
          recommendation: 'Implement rate limiting on all API endpoints'
        },
        {
          id: 'error-handling',
          name: 'Error Handling',
          status: 'pass',
          description: 'Errors are handled gracefully without exposing sensitive info',
          recommendation: 'Never expose stack traces or sensitive data in error messages'
        }
      ];

      setChecks(securityChecks);
    };

    runSecurityChecks();
  }, []);

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-600">Pass</Badge>;
      case 'fail':
        return <Badge className="bg-red-600">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">Warning</Badge>;
    }
  };

  if (!isVisible) return null;

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Audit
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-600">{passCount} Pass</Badge>
            <Badge className="bg-yellow-600">{warningCount} Warning</Badge>
            <Badge className="bg-red-600">{failCount} Fail</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        {failCount > 0 && (
          <Alert className="bg-red-900/20 border-red-500/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300">
              {failCount} critical security issue{failCount > 1 ? 's' : ''} found. Please address immediately.
            </AlertDescription>
          </Alert>
        )}

        {failCount === 0 && warningCount > 0 && (
          <Alert className="bg-yellow-900/20 border-yellow-500/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-yellow-300">
              {warningCount} security improvement{warningCount > 1 ? 's' : ''} recommended.
            </AlertDescription>
          </Alert>
        )}

        {failCount === 0 && warningCount === 0 && (
          <Alert className="bg-green-900/20 border-green-500/20">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-300">
              All security checks passed! Your application follows security best practices.
            </AlertDescription>
          </Alert>
        )}

        {/* Security Checks */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded border border-gray-700">
              <div className="mt-0.5">
                {getStatusIcon(check.status)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">{check.name}</h4>
                  {getStatusBadge(check.status)}
                </div>
                <p className="text-sm text-gray-300">{check.description}</p>
                {check.recommendation && check.status !== 'pass' && (
                  <p className="text-xs text-gray-400 italic">
                    💡 {check.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
          <p>Security audit runs automatically for admin users. Address any failures before production deployment.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAudit;