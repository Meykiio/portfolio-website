const Projects = () => {
  const projects = [
    {
      name: "RealCaptcha",
      content: "I got tired of clicking on traffic lights. So I turned CAPTCHAs into games. The twist? While you're playing, you're also generating useful data for AI. It's security, it's fun, it's a tiny resistance to robotic boredom.",
      tag: "Security + Fun"
    },
    {
      name: "Receipto",
      content: "Ever tried managing inventory off random paper receipts? Yeah, same. This tool scans receipts, extracts all the data, and helps track stuff like stock, damage, insights… Originally built for Printazix — now I'm turning it into something bigger.",
      tag: "AI + Inventory"
    },
    {
      name: "DocPlay",
      content: "Reading technical docs is usually a punishment. I made it into a game. Levels, voiceovers, micro-quests. Learn like you're in a mini RPG instead of reading a wall of text.",
      tag: "Learning + Games"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-16">
          Projects
        </h2>
        
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className="group relative bg-gradient-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-primary/10 text-primary text-xs font-mono px-3 py-1 rounded-full">
                  {project.tag}
                </span>
              </div>
              
              <h3 className="font-space text-2xl font-bold mb-4 mt-4">
                {project.name}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {project.content}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-sm font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>→</span>
                <span>Explore project</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;