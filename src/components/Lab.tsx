const Lab = () => {
  const experiments = [
    "Designing games that secretly train AIs to understand emotion",
    "Automating ad generation for Printazix from idea to export",
    "Creating a prompt-based coder that can audit and rewrite its own code",
    "Making a rap battle engine where you freestyle against an AI that claps back"
  ];

  return (
    <section id="lab" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-8">
          The Lab
        </h2>
        
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl leading-relaxed">
            You ever sit down to fix one thing and suddenly you're building a new universe?
          </p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-glass">
          <h3 className="font-space text-2xl font-semibold mb-8">
            Right now I'm:
          </h3>
          
          <div className="grid gap-6">
            {experiments.map((experiment, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                  <span className="text-primary font-mono text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-lg leading-relaxed">
                  {experiment}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="font-mono text-muted-foreground text-lg">
              Nothing is finished. Everything is in motion.
            </p>
            <p className="font-mono text-primary font-semibold mt-2">
              Just how I like it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lab;