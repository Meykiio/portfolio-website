const Contact = () => {
  const contactMethods = [
    { 
      label: "Instagram", 
      value: "@sifeddine.m", 
      href: "https://www.instagram.com/sifeddine.m/",
      description: "where I'm vaguely artistic"
    },
    { 
      label: "Facebook", 
      value: "sifeddinemeb", 
      href: "https://web.facebook.com/sifeddinemeb",
      description: "mostly memes and rebellion"
    },
    { 
      label: "LinkedIn", 
      value: "Sifeddine Mebarki", 
      href: "https://www.linkedin.com/in/sifeddine-mebarki-a3883a18b",
      description: "Not my favorite"
    },
    { 
      label: "GitHub", 
      value: "Meykiio", 
      href: "https://github.com/Meykiio",
      description: "it's messy, like life"
    }
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-12">
          Contact
        </h2>
        
        <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-glass">
          <div className="text-center mb-12">
            <p className="text-xl md:text-2xl leading-relaxed mb-6">
              Not selling anything. No hustle. No newsletter.
            </p>
            
            <div className="text-lg leading-relaxed space-y-4">
              <p>But if you:</p>
              <ul className="space-y-3 text-left max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono text-sm mt-1">→</span>
                  <span>Have a weird idea that needs a brain with trust issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono text-sm mt-1">→</span>
                  <span>Want to automate life so you can go outside once in a while</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono text-sm mt-1">→</span>
                  <span>Or just want to vibe with someone who's allergic to LinkedIn "Thought Leadership"...</span>
                </li>
              </ul>
              <p className="pt-4">
                Then slide into one of these:
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-primary font-semibold min-w-[80px]">
                    {method.label}:
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg text-white">
                      {method.value}
                    </span>
                    <span className="text-sm text-gray-400 italic">
                      {method.description}
                    </span>
                  </div>
                </div>
                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary hover:text-electric-cyan"
                >
                  →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;