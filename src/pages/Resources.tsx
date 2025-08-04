import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Filter, BookOpen, FileText, Code, Wrench, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";

const Resources = () => {
  const [resourcesData, setResourcesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedResource, setSelectedResource] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('resources');
        setResourcesData(data);
      } catch (error) {
        console.error('Failed to load resources data:', error);
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

  if (!resourcesData) {
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

  const typeIcons = {
    "ebook": BookOpen,
    "documentation": FileText,
    "cheat sheet": Code,
    "course": GraduationCap,
    "tutorial": GraduationCap,
    "tool": Wrench,
  };

  const filteredResources = resourcesData?.resources?.filter((resource: any) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    
    return matchesSearch && matchesType;
  }) || [];

  const resourceTypes = [...new Set(resourcesData?.resources?.map((r: any) => r.type) || [])];

  const getTypeColor = (type: string) => {
    const colors = {
      "ebook": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "documentation": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "cheat sheet": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "course": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "tutorial": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "tool": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
                  {resourcesData.title}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {resourcesData.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filter */}
            <div className="mb-12 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search resources by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {resourceTypes.map((type: string) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource: any) => {
                const IconComponent = typeIcons[resource.type as keyof typeof typeIcons] || BookOpen;
                return (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-lg transition-all duration-300 border-border/40 cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Resource Details Modal */}
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedResource && (
                  <>
                    {React.createElement(typeIcons[selectedResource.type as keyof typeof typeIcons] || BookOpen, {
                      className: "h-5 w-5 text-primary"
                    })}
                    {selectedResource.name}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedResource && (
              <div className="space-y-6">
                <div>
                  <Badge className={getTypeColor(selectedResource.type)}>
                    {selectedResource.type}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedResource.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Links</h4>
                  <div className="space-y-2">
                    {selectedResource.links.map((link: any, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-between"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Resources;