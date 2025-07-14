const Mindset = () => {
  return (
    <section id="mindset" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-16">
          Mindset
        </h2>
        
        <div className="text-center mb-12">
          <h3 className="font-space text-2xl md:text-3xl font-semibold mb-6">
            I don't want to scale myself. I want to <strong className="text-primary">outsource my stress to a system</strong>.
          </h3>
        </div>
        
        <div className="grid gap-6 mb-12">
          <div className="glass-effect rounded-lg p-6 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:translate-x-1">
            <p className="font-mono text-lg leading-relaxed">
              If something's boring, I make a bot.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-6 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:translate-x-1">
            <p className="font-mono text-lg leading-relaxed">
              If I do it twice, I automate it before the third time gets cocky.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-6 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:translate-x-1">
            <p className="font-mono text-lg leading-relaxed">
              If it's weird and slightly unhinged? I'm in.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-6 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:translate-x-1">
            <p className="font-mono text-lg leading-relaxed">
              If it feels like a game and pays the bills — jackpot.
            </p>
          </div>
        </div>
        
        <div className="bg-foreground text-background rounded-2xl p-8 md:p-12 shadow-brutalist">
          <blockquote className="font-mono text-xl md:text-2xl leading-relaxed text-center">
            "I don't work hard. I work once, then let the system grind while I go build something else I'll probably abandon later."
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