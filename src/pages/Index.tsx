
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Lab from "@/components/Lab";
import Mindset from "@/components/Mindset";
import Contact from "@/components/Contact";
import AIAssistant from "@/components/AIAssistant";
import FloatingElements from "@/components/FloatingElements";
import { Button } from "@/components/ui/button";
import { LogIn, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        signOut();
      }
    } else {
      navigate('/login');
    }
  };

  const getAuthButtonText = () => {
    if (loading) return 'Loading...';
    if (user) {
      return isAdmin ? 'Admin Panel' : 'Sign Out';
    }
    return 'Login';
  };

  const getAuthButtonIcon = () => {
    if (user && isAdmin) {
      return <Settings className="w-4 h-4" />;
    }
    return <LogIn className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-dark text-white relative overflow-x-hidden">
      {/* Background Effects */}
      <FloatingElements />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-space-grotesk text-electric-cyan font-bold">
            Sifeddine.xyz
          </h1>
          <div className="flex items-center gap-4">
            {/* Only show admin link to admin users */}
            {user && isAdmin && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="text-gray-300 hover:text-electric-cyan hover:bg-electric-cyan/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleAuthAction}
              disabled={loading}
              className="border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-dark transition-colors"
            >
              {getAuthButtonIcon()}
              <span className="ml-2">{getAuthButtonText()}</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Hero />
        <About />
        <Projects />
        <Lab />
        <Mindset />
        <Contact />
      </main>

      {/* AI Assistant - Available to all users */}
      <AIAssistant />
    </div>
  );
};

export default Index;
