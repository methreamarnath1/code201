import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, User, CheckCircle2, BookOpen, Target, Star } from "lucide-react";

const GuideDetail = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const [guideData, setGuideData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('roadmaps');
        const guide = data.beginnerGuides.find((g: any) => g.id === guideId);
        setGuideData(guide);
      } catch (error) {
        console.error('Failed to load guide data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [guideId]);

  // Simulate reading progress based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  if (!guideData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Guide not found</h1>
            <p className="text-muted-foreground mb-6">The guide you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/roadmaps')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmaps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Fixed Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
          <div 
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${readProgress}%` }}
          />
        </div>

        {/* Header */}
        <section className="py-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/roadmaps')}
                className="mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Guides
              </Button>

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    {guideData.title}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {guideData.description}
                  </p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{guideData.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{guideData.readTime}</span>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Complete Guide
                  </Badge>
                </div>

                {/* Author Info */}
                <Card className="bg-muted/30 border-border/40">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{guideData.author}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{guideData.authorTitle}</p>
                        <div className="flex flex-wrap gap-2">
                          {guideData.achievements.map((achievement: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Table of Contents */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <Card className="border-border/40">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Table of Contents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {guideData.steps.map((step: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-sm leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <Card className="border-border/40">
                    <CardContent className="pt-8">
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        {/* Introduction */}
                        <div className="mb-12">
                          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            Introduction
                          </h2>
                          <p className="text-lg leading-relaxed">
                            {guideData.detailedContent.introduction}
                          </p>
                        </div>

                        <Separator className="my-8" />

                        {/* Sections */}
                        <div className="space-y-12">
                          {guideData.detailedContent.sections.map((section: any, index: number) => (
                            <div key={index} className="scroll-mt-8" id={`section-${index}`}>
                              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                {section.title}
                              </h2>
                              
                              <div className="pl-11">
                                <div 
                                  className="text-base leading-relaxed whitespace-pre-line"
                                  dangerouslySetInnerHTML={{ __html: section.content.replace(/\n\n/g, '</p><p class="mb-4">').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                />
                              </div>

                              {index < guideData.detailedContent.sections.length - 1 && (
                                <Separator className="mt-8" />
                              )}
                            </div>
                          ))}
                        </div>

                        <Separator className="my-8" />

                        {/* Conclusion */}
                        <div className="mb-8">
                          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            Conclusion
                          </h2>
                          <p className="text-lg leading-relaxed">
                            {guideData.detailedContent.conclusion}
                          </p>
                        </div>

                        {/* Next Steps */}
                        <Card className="bg-primary/5 border-primary/20">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="h-5 w-5 text-primary" />
                              Ready to Start?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">
                              Now that you've read through this comprehensive guide, it's time to put your knowledge into practice!
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <Button onClick={() => navigate('/roadmaps')}>
                                Explore More Guides
                              </Button>
                              <Button variant="outline" onClick={() => navigate('/dsa')}>
                                Start Practicing DSA
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default GuideDetail;