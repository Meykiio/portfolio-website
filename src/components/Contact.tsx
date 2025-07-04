import { Button } from "@/components/ui/button";

const Contact = () => {
  const contactMethods = [
    { label: "Email", value: "sifeddine@yourdomain.com", href: "mailto:sifeddine@yourdomain.com" },
    { label: "Twitter", value: "@sifeddinexyz", href: "https://twitter.com/sifeddinexyz" },
    { label: "Direct", value: "Drop a DM and say \"yo, I read the site. Let's build.\"", href: "#" }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-space text-4xl md:text-5xl font-bold text-center mb-12">
          Contact
        </h2>
        
        <div className="bg-gradient-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 md:p-12 shadow-glass">
          <div className="text-center mb-12">
            <p className="text-xl md:text-2xl leading-relaxed mb-6">
              Look, I'm not trying to sell anything here.
            </p>
            
            <div className="text-lg leading-relaxed space-y-4">
              <p>But if you:</p>
              <ul className="space-y-3 text-left max-w-2xl mx-auto">
                {[
                  "have a strange idea that needs someone who thinks sideways",
                  "want to build something that doesn't need constant attention",
                  "are tired of things being too serious, too slow, or too broken"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-mono text-sm mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-4">
                Then yeah, maybe we should talk.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-primary font-semibold min-w-[80px]">
                    {method.label}:
                  </span>
                  <span className="text-lg">
                    {method.value}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  asChild
                >
                  <a href={method.href} target="_blank" rel="noopener noreferrer">
                    →
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;