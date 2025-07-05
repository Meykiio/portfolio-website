const About = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-glass">
          <h2 className="font-space text-3xl md:text-4xl font-bold mb-8 text-center">
            About Me
          </h2>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Honestly, I'm just someone who can't stop thinking in systems. Sometimes those systems become apps. Sometimes they become obsessions. Sometimes they crash, and I laugh, and then make them better.
            </p>
            
            <p>
              I'm based in <span className="font-semibold text-primary">Algiers</span>. I work alone a lot. But I'm never really alone — I've got AI assistants, side projects, voices in my head, all helping out.
            </p>
            
            <div className="bg-secondary/50 rounded-lg p-6 my-8">
              <h3 className="font-space text-xl font-semibold mb-4">What I care about:</h3>
              <ul className="space-y-3">
                {[
                  "Making tools that think",
                  "Automating stuff that eats time for no reason",
                  "Building things that feel more like play than work",
                  "Mixing tech, psychology, design, and intuition",
                  "Chasing freedom — not just financial, but mental too"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-mono text-sm mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;