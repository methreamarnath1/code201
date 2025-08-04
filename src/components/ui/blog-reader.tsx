import { X, Calendar, Clock, User, Share2, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card } from "./card";

interface BlogReaderProps {
  blog: {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    date: string;
    readTime: string;
    tags: string[];
    image?: string;
  };
  onClose: () => void;
}

export const BlogReader = ({ blog, onClose }: BlogReaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('```')) {
        return null; // Handle code blocks separately
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      if (paragraph.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-4 mb-2">
            {paragraph.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (paragraph.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 mb-2 list-disc">
            {paragraph.replace('- ', '')}
          </li>
        );
      }
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{blog.category}</Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(blog.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.readTime}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {blog.author}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
          
          {blog.image && (
            <div className="mb-8">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {formatContent(blog.content)}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comments
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};