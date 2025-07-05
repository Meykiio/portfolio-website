
import Dither from "./Dither";

const About = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Dither Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <Dither
          color1="#00FFFF"
          color2="#0A0A0A"
          scale={3}
          speed={0.3}
          intensity={0.6}
        />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-16">
          About Me
        </h2>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <p>
            Honestly, I'm just someone who can't stop thinking in systems. Sometimes those systems become apps. Sometimes they become obsessions. Sometimes they crash, and I laugh, and then make them better.
          </p>
          
          <p>
            I'm based in <span className="text-primary font-semibold">Algiers</span>. I work alone a lot. But I'm never really alone — I've got AI assistants, side projects, voices in my head, all helping out.
          </p>
          
          <div className="glass-effect rounded-2xl p-8 space-y-6">
            <h3 className="font-space text-2xl font-bold text-primary">What I care about:</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span>Making tools that think</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span>Automating stuff that eats time for no reason</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span>Building things that feel more like play than work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span>Mixing tech, psychology, design, and intuition</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span>Chasing freedom — not just financial, but mental too</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
