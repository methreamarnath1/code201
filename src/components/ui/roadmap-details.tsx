import { X, Clock, TrendingUp, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface RoadmapDetailsProps {
  roadmap: {
    id: string;
    title: string;
    description: string;
    timeline: string;
    difficulty: string;
    skills: string[];
    detailedPath?: {
      phases: Array<{
        title: string;
        duration: string;
        description: string;
        skills: string[];
        projects: string[];
        resources: Array<{
          name: string;
          type: string;
          url?: string;
        }>;
      }>;
    };
    resources?: Array<{
      phase: string;
      items: string[];
    }>;
  };
  onClose: () => void;
}

export const RoadmapDetails = ({ roadmap, onClose }: RoadmapDetailsProps) => {
  const difficultyColors = {
    "Beginner": "bg-code-green/10 text-code-green border-code-green/20",
    "Intermediate": "bg-learning-orange/10 text-learning-orange border-learning-orange/20",
    "Advanced": "bg-destructive/10 text-destructive border-destructive/20",
    "Beginner to Advanced": "bg-primary/10 text-primary border-primary/20",
    "Intermediate to Advanced": "bg-secondary/10 text-secondary border-secondary/20"
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{roadmap.title} Roadmap</h1>
            <Badge className={difficultyColors[roadmap.difficulty as keyof typeof difficultyColors]}>
              {roadmap.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {roadmap.timeline}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-lg text-muted-foreground mb-8">{roadmap.description}</p>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed-path">Detailed Path</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Skills You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {roadmap.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-code-green" />
                        <span className="font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="detailed-path" className="space-y-6 mt-6">
              {roadmap.detailedPath ? (
                <div className="space-y-6">
                  {roadmap.detailedPath.phases.map((phase, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">
                            Phase {index + 1}: {phase.title}
                          </CardTitle>
                          <Badge variant="outline">{phase.duration}</Badge>
                        </div>
                        <CardDescription>{phase.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Skills to Learn
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Projects to Build</h4>
                          <ul className="space-y-1">
                            {phase.projects.map((project, projectIndex) => (
                              <li key={projectIndex} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-code-green" />
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Recommended Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {phase.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                <div>
                                  <span className="font-medium text-sm">{resource.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">({resource.type})</span>
                                </div>
                                {resource.url && (
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Detailed learning path coming soon!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-6 mt-6">
              {roadmap.resources && roadmap.resources.length > 0 ? (
                <div className="space-y-4">
                  {roadmap.resources.map((resource, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{resource.phase}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {resource.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="p-3 bg-muted/50 rounded-lg">
                              <span className="text-sm font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Resource collection coming soon!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};