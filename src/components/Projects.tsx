import InteractiveCard from "./InteractiveCard";

const Projects = () => {
  const projects = [
    {
      name: "Yuno",
      link: "https://yuno-bolt.netlify.app/",
      content: "Yuno flips CAPTCHAs into micro-challenges that are fun for humans and useful for AI. It's like a playground for proving your humanity while generating emotionally intelligent data. Play to train — that's the Yuno way.",
      tag: "Security + Fun"
    },
    {
      name: "Receipto",
      link: "https://receipto-app.vercel.app/",
      content: "Receipto automates inventory by reading receipts, extracting data, and turning them into a living stock database. Originally built for Printazix, now expanding to help small businesses get organized without manual work.",
      tag: "AI + Inventory"
    },
    {
      name: "Wishdrop",
      link: "https://wishdrop.lovable.app/",
      content: "Wishdrop is like a wish wall for dreamers — where you post what you need, and anonymous givers can help make it real. It's social giving gamified with leaderboards and good vibes. A love letter to generosity and serendipity.",
      tag: "Social + Giving"
    }
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-16">
          Projects
        </h2>
        
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <InteractiveCard
              key={project.name}
              className="group glass-effect rounded-2xl p-8 shadow-glass hover:shadow-brutalist transition-all duration-300 hover:-translate-y-2"
              glowColor="primary"
            >
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-primary/10 text-primary text-xs font-mono px-3 py-1 rounded-full">
                  {project.tag}
                </span>
              </div>
              
              <h3 className="font-space text-2xl font-bold mb-4 mt-4">
                {project.name}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {project.content}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-sm font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>→</span>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Explore project
                </a>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;