import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Clock, User, Award } from "lucide-react";

interface GuideDetailsProps {
  guide: any;
  onClose: () => void;
}

export function GuideDetails({ guide, onClose }: GuideDetailsProps) {
  if (!guide) return null;

  return (
    <Dialog open={!!guide} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/40">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-bold">{guide.title}</DialogTitle>
              <p className="text-muted-foreground">{guide.description}</p>
              
              {/* Author Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{guide.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{guide.readTime}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">{guide.authorTitle}</p>
                <div className="flex flex-wrap gap-1">
                  {guide.achievements?.map((achievement: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-8">
            {/* Introduction */}
            {guide.detailedContent?.introduction && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Introduction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {guide.detailedContent.introduction}
                </p>
              </div>
            )}

            {/* Detailed Sections */}
            {guide.detailedContent?.sections?.map((section: any, index: number) => (
              <Card key={index} className="border-border/40">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                  <div className="prose prose-sm max-w-none">
                    {section.content.split('\n\n').map((paragraph: string, pIndex: number) => {
                      // Handle code blocks
                      if (paragraph.includes('```')) {
                        const codeContent = paragraph.replace(/```\w*\n?/g, '').replace(/```/g, '');
                        return (
                          <pre key={pIndex} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                            <code className="text-sm">{codeContent}</code>
                          </pre>
                        );
                      }
                      
                      // Handle bold text
                      const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      
                      return (
                        <p 
                          key={pIndex} 
                          className="text-muted-foreground leading-relaxed mb-4 last:mb-0"
                          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Conclusion */}
            {guide.detailedContent?.conclusion && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Conclusion</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {guide.detailedContent.conclusion}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Steps Summary */}
            <Card className="border-border/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Steps Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guide.steps?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}