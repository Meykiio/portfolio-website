import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Silk from '@/components/Silk';
import MetaBalls from '@/components/MetaBalls';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Access Granted",
        description: "Welcome back, admin.",
      });
      navigate('/');
    }
    
    setLoading(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Red Silk Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <Silk
          speed={3}
          scale={1.2}
          color="#FF0000"
          noiseIntensity={2}
          rotation={45}
        />
      </div>

      {/* Red MetaBalls */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        <MetaBalls
          color="#FF0000"
          cursorBallColor="#FF4444"
          speed={0.2}
          ballCount={8}
          animationSize={25}
          enableTransparency={true}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Warning Header */}
        <div className="text-center mb-8 animate-pulse">
          <div className="text-6xl md:text-8xl font-bold text-red-500 mb-4 font-mono">
            ⚠️ SYSTEM BREACH ⚠️
          </div>
          <div className="text-xl md:text-2xl text-red-400 font-mono mb-2">
            UNAUTHORIZED ACCESS DETECTED
          </div>
          <div className="text-lg md:text-xl text-muted-foreground font-mono">
            Your system has been compromised
          </div>
        </div>

        {/* Fake Error Messages */}
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 md:p-6 max-w-md w-full mb-8 font-mono text-sm">
          <div className="text-red-400 mb-2">[ERROR] Security protocols breached</div>
          <div className="text-red-400 mb-2">[ERROR] Data extraction in progress...</div>
          <div className="text-red-400 mb-2">[ERROR] Firewall disabled</div>
          <div className="text-green-400">[SUCCESS] Backdoor installed</div>
        </div>

        {/* Fake System Info */}
        <div className="text-center mb-8 font-mono text-sm text-muted-foreground">
          <div>IP: {Math.floor(Math.random() * 256)}.{Math.floor(Math.random() * 256)}.{Math.floor(Math.random() * 256)}.{Math.floor(Math.random() * 256)}</div>
          <div>Location: Unknown</div>
          <div>Status: COMPROMISED</div>
        </div>

        {/* Fake Download Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg border-2 border-red-400 shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-lg animate-bounce"
            >
              🦠 DOWNLOAD MALWARE 🦠
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-red-500/20">
            <DialogHeader>
              <DialogTitle className="text-center text-red-400 font-mono">
                ADMIN ACCESS REQUIRED
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground font-mono">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border"
                  placeholder="admin@system.local"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-foreground font-mono">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-border"
                  placeholder="Enter admin password"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono"
              >
                {loading ? 'AUTHENTICATING...' : 'GRANT ACCESS'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bottom Text */}
        <div className="text-center mt-8 font-mono text-xs text-muted-foreground">
          <div>Just kidding! This is actually Sifeddine's portfolio.</div>
          <div className="mt-2">Admin login required to access the dashboard.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;