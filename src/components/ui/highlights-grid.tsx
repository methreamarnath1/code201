import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Route, Library, PenTool, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HighlightsGridProps {
  highlights: Highlight[];
}

const iconMap = {
  brain: Brain,
  route: Route,
  library: Library,
  "pen-tool": PenTool,
  users: Users,
};

const colorMap = {
  primary: "border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10",
  secondary: "border-secondary/20 hover:border-secondary/40 bg-secondary/5 hover:bg-secondary/10",
  accent: "border-accent/20 hover:border-accent/40 bg-accent/5 hover:bg-accent/10",
  "wisdom-gold": "border-wisdom-gold/20 hover:border-wisdom-gold/40 bg-wisdom-gold/5 hover:bg-wisdom-gold/10",
  "code-green": "border-code-green/20 hover:border-code-green/40 bg-code-green/5 hover:bg-code-green/10",
};

const getRoute = (id: string) => {
  const routes: { [key: string]: string } = {
    dsa: "/dsa",
    roadmaps: "/roadmaps",
    resources: "/resources",
    blogs: "/blogs",
    community: "/contact",
  };
  return routes[id] || "/";
};

const HighlightsGrid = ({ highlights }: HighlightsGridProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Master Coding
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From structured learning paths to vibrant communities, discover all the resources
            you need for your coding journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => {
            const IconComponent = iconMap[highlight.icon as keyof typeof iconMap];
            const colorClass = colorMap[highlight.color as keyof typeof colorMap];
            
            return (
              <Card
                key={highlight.id}
                className={cn(
                  "relative group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                  colorClass
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm">
                      {IconComponent && (
                        <IconComponent className="h-6 w-6 text-foreground" />
                      )}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {highlight.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {highlight.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between group-hover:bg-background/50"
                  >
                    <Link to={getRoute(highlight.id)}>
                      Explore
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightsGrid;