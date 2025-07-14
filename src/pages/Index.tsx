import Hero from "@/components/Hero";
import { Suspense } from "react";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Lab from "@/components/Lab";
import Mindset from "@/components/Mindset";
import Contact from "@/components/Contact";
import FloatingElements from "@/components/FloatingElements";
import { useAuth } from "@/contexts/AuthContext";
import { AIAssistant, MetaBalls, Silk } from "@/components/LazyComponents";

const Index = () => {
  const { user, isAdmin } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-electric-cyan transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-gray-300 hover:text-electric-cyan transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('lab')}
              className="text-gray-300 hover:text-electric-cyan transition-colors"
            >
              Lab
            </button>
            <button
              onClick={() => scrollToSection('mindset')}
              className="text-gray-300 hover:text-electric-cyan transition-colors"
            >
              Mindset
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-electric-cyan transition-colors"
            >
              Contact
            </button>
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

      {/* AI Assistant - Available to all users except admins */}
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </div>
  );
};

export default Index;