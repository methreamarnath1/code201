import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Shuffle, 
  CheckSquare, 
  Square, 
  Star, 
  FileText, 
  Play,
  Youtube,
  BookOpen,
  Code
} from "lucide-react";

interface Question {
  id: number;
  name: string;
  difficulty: string;
  solveLink: string;
  resourcePaid: string;
  resourceFree: string;
  practiceLink: string;
  notesLink: string;
}

interface Lecture {
  id: number;
  title: string;
  questions: Question[];
}

interface Step {
  id: number;
  title: string;
  lectures: Lecture[];
}

interface DSAData {
  title: string;
  description: string;
  note: string;
  totalQuestions: number;
  progressSummary: {
    easy: { total: number; completed: number };
    medium: { total: number; completed: number };
    hard: { total: number; completed: number };
  };
  steps: Step[];
}

const DSA = () => {
  const [dsaData, setDsaData] = useState<DSAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1])); 
  const [expandedLectures, setExpandedLectures] = useState<Set<number>>(new Set([1]));
  const [progress, setProgress] = useState<Record<number, { completed: boolean; starred: boolean }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('dsa_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (questionId: number, updates: Partial<{ completed: boolean; starred: boolean }>) => {
    const newProgress = {
      ...progress,
      [questionId]: {
        completed: false,
        starred: false,
        ...progress[questionId],
        ...updates
      }
    };
    setProgress(newProgress);
    localStorage.setItem('dsa_progress', JSON.stringify(newProgress));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('dsa');
        setDsaData(data);
      } catch (error) {
        console.error('Failed to load DSA data:', error);
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

  if (!dsaData) {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'hard': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
  };

  const toggleStepExpansion = (stepId: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const toggleLectureExpansion = (lectureId: number) => {
    const newExpanded = new Set(expandedLectures);
    if (newExpanded.has(lectureId)) {
      newExpanded.delete(lectureId);
    } else {
      newExpanded.add(lectureId);
    }
    setExpandedLectures(newExpanded);
  };

  // Calculate progress statistics
  const getProgressStats = () => {
    if (!dsaData?.steps) {
      return {
        total: 0,
        completed: 0,
        easy: 0,
        medium: 0,
        hard: 0
      };
    }

    const allQuestions = dsaData.steps.flatMap(step => 
      step.lectures.flatMap(lecture => lecture.questions)
    );
    
    let completedEasy = 0, completedMedium = 0, completedHard = 0;
    let totalCompleted = 0;
    
    allQuestions.forEach(question => {
      if (progress[question.id]?.completed) {
        totalCompleted++;
        switch (question.difficulty.toLowerCase()) {
          case 'easy': completedEasy++; break;
          case 'medium': completedMedium++; break;
          case 'hard': completedHard++; break;
        }
      }
    });

    return {
      total: allQuestions.length,
      completed: totalCompleted,
      easy: completedEasy,
      medium: completedMedium,
      hard: completedHard
    };
  };

  const stats = getProgressStats();

  const filteredSteps = dsaData.steps.map(step => ({
    ...step,
    lectures: step.lectures.map(lecture => ({
      ...lecture,
      questions: lecture.questions.filter(question => {
        const matchesSearch = question.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "All" || question.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
      })
    })).filter(lecture => lecture.questions.length > 0)
  })).filter(step => step.lectures.length > 0);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">{dsaData.title}</h1>
              <p className="text-muted-foreground mb-4">{dsaData.description}</p>
              
              {/* Important Note */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                <p className="text-red-600 text-sm font-medium">{dsaData.note}</p>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-primary/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.completed} / {dsaData.totalQuestions}</div>
                      <div className="text-sm text-muted-foreground">Total Progress</div>
                      <Progress value={(stats.completed / dsaData.totalQuestions) * 100} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-500/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.easy} / {dsaData.progressSummary.easy.total}</div>
                      <div className="text-sm text-muted-foreground">Easy</div>
                      <Progress value={(stats.easy / dsaData.progressSummary.easy.total) * 100} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.medium} / {dsaData.progressSummary.medium.total}</div>
                      <div className="text-sm text-muted-foreground">Medium</div>
                      <Progress value={(stats.medium / dsaData.progressSummary.medium.total) * 100} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-500/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.hard} / {dsaData.progressSummary.hard.total}</div>
                      <div className="text-sm text-muted-foreground">Hard</div>
                      <Progress value={(stats.hard / dsaData.progressSummary.hard.total) * 100} className="h-2 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Pick Random
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto space-y-4">
            {filteredSteps.map((step) => {
              const isStepExpanded = expandedSteps.has(step.id);
              
              return (
                <Card key={step.id} className="border">
                  <Collapsible open={isStepExpanded} onOpenChange={() => toggleStepExpansion(step.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {isStepExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                            {step.title}
                          </CardTitle>
                          <Badge variant="secondary">
                            {step.lectures.reduce((acc, lecture) => acc + lecture.questions.length, 0)} questions
                          </Badge>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {step.lectures.map((lecture) => {
                            const isLectureExpanded = expandedLectures.has(lecture.id);
                            
                            return (
                              <Card key={lecture.id} className="border-border/40">
                                <Collapsible open={isLectureExpanded} onOpenChange={() => toggleLectureExpansion(lecture.id)}>
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors py-3">
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                          {isLectureExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                          ) : (
                                            <ChevronDown className="h-4 w-4" />
                                          )}
                                          {lecture.title}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-xs">
                                          {lecture.questions.length} questions
                                        </Badge>
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  
                                  <CollapsibleContent>
                                    <CardContent className="pt-0">
                                      {/* Questions Table */}
                                      <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-muted/30 px-4 py-2 grid grid-cols-12 gap-2 text-sm font-medium border-b">
                                          <div className="col-span-1"></div>
                                          <div className="col-span-4">Problem</div>
                                          <div className="col-span-1 text-center">Solve</div>
                                          <div className="col-span-1 text-center">Resource</div>
                                          <div className="col-span-1 text-center">Resource</div>
                                          <div className="col-span-1 text-center">Practice</div>
                                          <div className="col-span-1 text-center">Notes</div>
                                          <div className="col-span-1 text-center">Revision</div>
                                          <div className="col-span-1 text-center">Difficulty</div>
                                        </div>
                                        
                                        {lecture.questions.map((question) => {
                                          const questionProgress = progress[question.id] || { completed: false, starred: false };
                                          
                                          return (
                                            <div key={question.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                                              {/* Checkbox */}
                                              <div className="col-span-1">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-6 w-6 p-0"
                                                  onClick={() => saveProgress(question.id, { completed: !questionProgress.completed })}
                                                >
                                                  {questionProgress.completed ? (
                                                    <CheckSquare className="h-4 w-4 text-green-600" />
                                                  ) : (
                                                    <Square className="h-4 w-4 text-muted-foreground" />
                                                  )}
                                                </Button>
                                              </div>
                                              
                                              {/* Problem Name */}
                                              <div className="col-span-4">
                                                <span className="font-medium text-sm">{question.name}</span>
                                              </div>
                                              
                                              {/* Solve Link */}
                                              <div className="col-span-1 text-center">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                  <a href={question.solveLink} target="_blank" rel="noopener noreferrer">
                                                    <Play className="h-3 w-3" />
                                                  </a>
                                                </Button>
                                              </div>
                                              
                                              {/* Resource Paid */}
                                              <div className="col-span-1 text-center">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                  <a href={question.resourcePaid} target="_blank" rel="noopener noreferrer">
                                                    <Youtube className="h-3 w-3 text-red-500" />
                                                  </a>
                                                </Button>
                                              </div>
                                              
                                              {/* Resource Free */}
                                              <div className="col-span-1 text-center">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                  <a href={question.resourceFree} target="_blank" rel="noopener noreferrer">
                                                    <Youtube className="h-3 w-3 text-blue-500" />
                                                  </a>
                                                </Button>
                                              </div>
                                              
                                              {/* Practice Link */}
                                              <div className="col-span-1 text-center">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                  <a href={question.practiceLink} target="_blank" rel="noopener noreferrer">
                                                    <Code className="h-3 w-3" />
                                                  </a>
                                                </Button>
                                              </div>
                                              
                                              {/* Notes Link */}
                                              <div className="col-span-1 text-center">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                  <a href={question.notesLink} target="_blank" rel="noopener noreferrer">
                                                    <FileText className="h-3 w-3" />
                                                  </a>
                                                </Button>
                                              </div>
                                              
                                              {/* Revision Star */}
                                              <div className="col-span-1 text-center">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-6 w-6 p-0"
                                                  onClick={() => saveProgress(question.id, { starred: !questionProgress.starred })}
                                                >
                                                  <Star className={`h-3 w-3 ${questionProgress.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                                                </Button>
                                              </div>
                                              
                                              {/* Difficulty */}
                                              <div className="col-span-1 text-center">
                                                <Badge className={getDifficultyColor(question.difficulty)} variant="outline">
                                                  {question.difficulty}
                                                </Badge>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Collapsible>
                              </Card>
                            );
                          })}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DSA;