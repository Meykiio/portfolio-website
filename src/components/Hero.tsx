import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";
import MetaBalls from "./MetaBalls";

import TextScramble from "./TextScramble";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      
      {/* MetaBalls Interactive Layer */}
      <div className="absolute inset-0 opacity-60">
        <MetaBalls
          color="#00FFFF"
          cursorBallColor="#FFFFFF"
          cursorBallSize={3}
          ballCount={12}
          animationSize={40}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.08}
          clumpFactor={0.8}
          speed={0.2}
        />
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-background/20"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-6 animate-slide-up">
          <h1 className="font-space text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            Hey, I'm{" "}
            <span className="text-primary animate-float inline-block">
              <TextScramble text="Sifeddine" />
            </span>
            .
          </h1>
          
          <div className="space-y-4 text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-3xl mx-auto">
            <p>I like building things that run without me.</p>
            
            <p className="text-muted-foreground">
              Not in a lazy way — in a{" "}
              <span className="text-foreground font-semibold">
                "my time is worth more than repetition"
              </span>{" "}
              kind of way.
            </p>
            
            <p>
              If something feels boring, I try to systemize it. If something feels broken, I turn it into a tool. If it makes me curious, I stay with it until it turns into something weird or useful.
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground font-mono">
            Welcome to the space where all that lives.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-scale-in">
          <Button variant="cta" size="xl" className="font-space">
            See What I Build
          </Button>
          <Button variant="glass" size="xl" className="font-space">
            Read My Mindset
          </Button>
          <Button variant="brutalist" size="xl" className="font-space">
            Pitch Me Something Weird
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;