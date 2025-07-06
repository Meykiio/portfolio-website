import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Lab from "@/components/Lab";
import Mindset from "@/components/Mindset";
import Contact from "@/components/Contact";
import Silk from "@/components/Silk";
import AIAssistant from "@/components/AIAssistant";
import FloatingElements from "@/components/FloatingElements";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Global Silk Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      
      {/* Floating Elements */}
      <FloatingElements />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="font-space font-bold text-lg md:text-xl">
            Sifeddine.xyz
          </div>
          <div className="hidden md:flex gap-4 lg:gap-6 font-mono text-sm">
            <a href="#about" className="hover:text-primary transition-colors duration-200">
              About
            </a>
            <a href="#projects" className="hover:text-primary transition-colors duration-200">
              Projects
            </a>
            <a href="#lab" className="hover:text-primary transition-colors duration-200">
              Lab
            </a>
            <a href="#mindset" className="hover:text-primary transition-colors duration-200">
              Mindset
            </a>
            <a href="#contact" className="hover:text-primary transition-colors duration-200">
              Contact
            </a>
            <a href="/admin" className="hover:text-primary transition-colors duration-200">
              Admin
            </a>
          </div>
        </div>
      </nav>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        
        <div id="about">
          <About />
        </div>
        
        <div id="projects">
          <Projects />
        </div>
        
        <div id="lab">
          <Lab />
        </div>
        
        <div id="mindset">
          <Mindset />
        </div>
        
        <div id="contact">
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-6 border-t border-border/20 glass-effect">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-sm md:text-base text-muted-foreground">
            Built with systems, not stress. © 2024 Sifeddine.xyz
          </p>
          <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm">
            <span className="text-primary">●</span>
            <span className="text-muted-foreground">Algiers</span>
            <span className="text-primary">●</span>
            <span className="text-muted-foreground hidden sm:inline">Building the future, one weird tool at a time</span>
            <span className="text-muted-foreground sm:hidden">Building the future</span>
            <span className="text-primary">●</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;