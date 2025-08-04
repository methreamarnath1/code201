import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Clock, 
  Users, 
  TrendingUp, 
  Star, 
  ExternalLink,
  Send,
  Handshake,
  Target,
  Zap
} from "lucide-react";
import SocialLinks from "@/components/ui/social-links";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('contact');
        setContactData(data);
      } catch (error) {
        console.error('Failed to load contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!contactData) {
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {contactData.title}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {contactData.description}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Mail className="h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Have a question, proposal, or just want to say hello? We'd love to hear from you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more..."
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg">
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contactData.contactInfo.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {contactData.contactInfo.response}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Handshake className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Partnerships</p>
                        <p className="text-sm text-muted-foreground">
                          {contactData.contactInfo.availability}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Stats */}
                <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Community Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-primary">
                          {contactData.communityStats.totalMembers}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Members</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-secondary">
                          {contactData.communityStats.monthlyViews}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Views</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-accent">
                          {contactData.communityStats.contentPieces}
                        </div>
                        <div className="text-sm text-muted-foreground">Content Pieces</div>
                      </div>
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-wisdom-gold">
                          {contactData.communityStats.successStories}
                        </div>
                        <div className="text-sm text-muted-foreground">Success Stories</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Business Opportunities */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Business Opportunities</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Partner with CodeVeda to reach our growing community and create meaningful impact
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sponsorship */}
              <Card className="border-border/40 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Star className="h-6 w-6 text-wisdom-gold" />
                    {contactData.businessOpportunities.sponsorship.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {contactData.businessOpportunities.sponsorship.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Benefits
                  </h4>
                  <div className="space-y-2">
                    {contactData.businessOpportunities.sponsorship.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-code-green" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6">
                    Explore Sponsorship
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Partnerships */}
              <Card className="border-border/40 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="h-6 w-6 text-secondary" />
                    {contactData.businessOpportunities.partnerships.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {contactData.businessOpportunities.partnerships.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Opportunities
                  </h4>
                  <div className="space-y-2">
                    {contactData.businessOpportunities.partnerships.opportunities.map((opportunity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-secondary" />
                        <span className="text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6">
                    Partner with Us
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Connect with Our Community</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of learners across different platforms
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {contactData.socialLinks.map((link: any) => (
                <Card key={link.platform} className="hover:shadow-lg transition-all duration-300 border-border/40">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{link.platform}</CardTitle>
                    <Badge variant="outline" className="mx-auto">{link.followers || link.members}</Badge>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        Join {link.platform}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;