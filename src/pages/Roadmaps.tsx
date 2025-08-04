import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapDetails } from "@/components/ui/roadmap-details";
import { Clock, Users, TrendingUp, MapPin, CheckCircle2, BookOpen, User } from "lucide-react";

const Roadmaps = () => {
  const navigate = useNavigate();
  const [roadmapsData, setRoadmapsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('roadmaps');
        setRoadmapsData(data);
      } catch (error) {
        console.error('Failed to load roadmaps data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!roadmapsData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Failed to load content</h1>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </Layout>
    );
  }

  const difficultyColors = {
    "Beginner": "bg-code-green/10 text-code-green border-code-green/20",
    "Intermediate": "bg-learning-orange/10 text-learning-orange border-learning-orange/20",
    "Advanced": "bg-destructive/10 text-destructive border-destructive/20",
    "Beginner to Advanced": "bg-primary/10 text-primary border-primary/20",
    "Intermediate to Advanced": "bg-secondary/10 text-secondary border-secondary/20"
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {roadmapsData.title}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {roadmapsData.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="roadmaps" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12">
                <TabsTrigger value="roadmaps" className="text-base">Career Roadmaps</TabsTrigger>
                <TabsTrigger value="guides" className="text-base">Beginner Guides</TabsTrigger>
              </TabsList>

              <TabsContent value="roadmaps" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Career Roadmaps</h2>
                  <p className="text-lg text-muted-foreground">
                    Structured paths to help you achieve your career goals
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {roadmapsData.careerRoadmaps.map((roadmap: any) => (
                    <Card key={roadmap.id} className="hover:shadow-lg transition-all duration-300 border-border/40">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-2xl">{roadmap.title}</CardTitle>
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <CardDescription className="text-base mb-4">
                          {roadmap.description}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={difficultyColors[roadmap.difficulty as keyof typeof difficultyColors]}>
                            {roadmap.difficulty}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {roadmap.timeline}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Key Skills
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {roadmap.skills.map((skill: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3 w-3 text-code-green" />
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>

                        {roadmap.resources && (
                          <div>
                            <h4 className="font-semibold mb-3">Learning Resources</h4>
                            <div className="space-y-2">
                              {roadmap.resources.map((resource: any, index: number) => (
                                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                  <h5 className="font-medium text-sm">{resource.phase}</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {resource.items.join(", ")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button className="w-full" onClick={() => setSelectedRoadmap(roadmap)}>
                          Start Learning Path
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="guides" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Beginner Guides</h2>
                  <p className="text-lg text-muted-foreground">
                    Step-by-step guides to get you started on the right path
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {roadmapsData.beginnerGuides.map((guide: any, index: number) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border/40">
                      <CardHeader>
                        <div className="flex items-start gap-3 mb-3">
                          <BookOpen className="h-5 w-5 text-primary mt-1" />
                          <div className="flex-1">
                            <CardTitle className="text-xl">{guide.title}</CardTitle>
                            <CardDescription className="mt-1">{guide.description}</CardDescription>
                          </div>
                        </div>
                        
                        {/* Author and Meta Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{guide.author}</span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {guide.readTime}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{guide.authorTitle}</p>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                              What You'll Learn
                            </h4>
                            {guide.steps.slice(0, 4).map((step: string, stepIndex: number) => (
                              <div key={stepIndex} className="flex items-start gap-3 mb-2">
                                <div className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                  {stepIndex + 1}
                                </div>
                                <p className="text-sm leading-relaxed">{step}</p>
                              </div>
                            ))}
                            {guide.steps.length > 4 && (
                              <p className="text-xs text-muted-foreground mt-2">
                                +{guide.steps.length - 4} more steps
                              </p>
                            )}
                          </div>

                          <Button 
                            className="w-full" 
                            onClick={() => navigate(`/roadmaps/guide/${guide.id}`)}
                          >
                            Read Full Guide
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {selectedRoadmap && (
          <RoadmapDetails 
            roadmap={selectedRoadmap} 
            onClose={() => setSelectedRoadmap(null)} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Roadmaps;