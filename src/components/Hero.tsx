import { Button } from "@/components/ui/button";
import TextScramble from "./TextScramble";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-6 py-20 relative">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
        {/* Name and Title */}
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-space font-bold text-foreground">
            Hey, I'm Sifeddine.
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl font-mono text-primary">
            <TextScramble
              text="I like building things that run without me."
              className="inline-block"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          <p>
            Not in a lazy way — in a "my time is worth more than repetition" kind of way. 
            If something feels boring, I try to systemize it. If something feels broken, 
            I turn it into a tool. If it makes me curious, I stay with it until it turns 
            into something weird or useful.
          </p>
          <p className="text-primary font-medium">
            Welcome to the space where all that lives.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6 px-4">
          <Button 
            size="lg" 
            className="font-mono text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
            onClick={() => scrollToSection('projects')}
          >
            See What I Build
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="font-mono text-base md:text-lg px-6 md:px-8 py-4 md:py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => scrollToSection('mindset')}
          >
            Read My Mindset
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="font-mono text-base md:text-lg px-6 md:px-8 py-4 md:py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => scrollToSection('contact')}
          >
            Pitch Me Something Weird
          </Button>
        </div>

        {/* Tech Stack Indicators */}
        <div className="pt-8 md:pt-12">
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 font-mono">
            TECH STACK
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm font-mono px-4">
            <span className="px-2 md:px-3 py-1 border border-border rounded text-muted-foreground">
              React
            </span>
            <span className="px-2 md:px-3 py-1 border border-border rounded text-muted-foreground">
              Node.js
            </span>
            <span className="px-2 md:px-3 py-1 border border-border rounded text-muted-foreground">
              Python
            </span>
            <span className="px-2 md:px-3 py-1 border border-border rounded text-muted-foreground">
              AI/ML
            </span>
            <span className="px-2 md:px-3 py-1 border border-border rounded text-muted-foreground">
              PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;