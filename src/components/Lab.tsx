const Lab = () => {
  return (
    <section id="lab" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-8">
          The Lab
        </h2>
        
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl leading-relaxed italic text-gray-300">
            I don't build startups. I build weird little systems that refuse to behave.
          </p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-glass">
          <h3 className="font-space text-2xl font-semibold mb-8">
            Right now I'm:
          </h3>
          
          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                <span className="text-primary font-mono text-sm font-bold">01</span>
              </div>
              <p className="text-lg leading-relaxed">
                Testing what happens when <strong>wishes meet wallets</strong> (spoiler: chaos, magic, and maybe kindness)
              </p>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                <span className="text-primary font-mono text-sm font-bold">02</span>
              </div>
              <p className="text-lg leading-relaxed">
                Making CAPTCHAs that don't insult your intelligence (Yuno: prove you're human <em>by being human</em>)
              </p>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                <span className="text-primary font-mono text-sm font-bold">03</span>
              </div>
              <p className="text-lg leading-relaxed">
                Turning crumpled receipts into live inventory dashboards because spreadsheets are allergic to vibes (Receipto)
              </p>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                <span className="text-primary font-mono text-sm font-bold">04</span>
              </div>
              <p className="text-lg leading-relaxed">
                Prompting AI to do the work while I "supervise" with coffee and existential dread
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="font-mono text-muted-foreground text-lg">
              None of it's finished. Most of it's unstable.
            </p>
            <p className="font-mono text-primary font-semibold mt-2">
              And that's exactly where the fun starts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lab;