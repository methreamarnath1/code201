import { Button } from "@/components/ui/button";
import { ExternalLink, Linkedin, MessageCircle, Send, Instagram } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  description: string;
}

interface SocialLinksProps {
  socialLinks: SocialLink[];
  title?: string;
  description?: string;
}

const SocialLinks = ({ 
  socialLinks, 
  title = "Join Our Community", 
  description = "Connect with fellow learners and stay updated with the latest content"
}: SocialLinksProps) => {
  const platformIcons: { [key: string]: any } = {
    LinkedIn: Linkedin,
    WhatsApp: MessageCircle,
    Telegram: Send,
    Instagram: Instagram,
  };

  const platformColors: { [key: string]: string } = {
    LinkedIn: "bg-[#0077b5] hover:bg-[#005885] text-white",
    WhatsApp: "bg-[#25d366] hover:bg-[#20ba5a] text-white",
    Telegram: "bg-[#0088cc] hover:bg-[#006ba6] text-white",
    Instagram: "bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:from-[#f57c00] hover:via-[#c2185b] hover:to-[#7b1fa2] text-white",
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {socialLinks.map((link) => {
            const IconComponent = platformIcons[link.platform] || ExternalLink;
            return (
              <Button
                key={link.platform}
                asChild
                variant="outline"
                className={`h-auto p-6 flex flex-col items-center space-y-4 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-background/80 backdrop-blur-sm ${
                  platformColors[link.platform] || "hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center w-full"
                >
                  <div className="w-12 h-12 rounded-full bg-current/10 flex items-center justify-center mb-3">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-semibold mb-2">{link.platform}</div>
                  <div className="text-sm opacity-80 leading-relaxed">
                    {link.description}
                  </div>
                  <div className="mt-3 flex items-center justify-center text-xs opacity-60">
                    Join Now <ExternalLink className="h-3 w-3 ml-1" />
                  </div>
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;