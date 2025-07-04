const Mindset = () => {
  const principles = [
    "If I do something twice, I build a system for it.",
    "If it's boring, I automate it.",
    "If it's weird, I follow it.",
    "If it feels like play and it earns money — that's the sweet spot."
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-16">
          Mindset
        </h2>
        
        <div className="text-center mb-12">
          <h3 className="font-space text-2xl md:text-3xl font-semibold mb-6">
            I believe in systems over stress.
          </h3>
        </div>
        
        <div className="grid gap-6 mb-12">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="bg-gradient-glass backdrop-blur-glass border border-white/20 rounded-lg p-6 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:translate-x-1"
            >
              <p className="font-mono text-lg leading-relaxed">
                {principle}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-foreground text-background rounded-2xl p-8 md:p-12 shadow-brutalist">
          <blockquote className="font-mono text-xl md:text-2xl leading-relaxed text-center">
            "I'm not trying to scale myself. I'm trying to build stuff that lives without me."
          </blockquote>
          <div className="text-center mt-6">
            <div className="w-16 h-0.5 bg-primary mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mindset;