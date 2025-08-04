import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlogReader } from "@/components/ui/blog-reader";
import { Search, Calendar, Clock, User, Share2, MessageCircle, Star } from "lucide-react";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState<any>(null);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('blogs');
        setBlogsData(data);
        setFilteredPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to load blogs data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!blogsData?.posts) return;

    let filtered = [...blogsData.posts];
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = dataService.filterBlogsByCategory(filtered, selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = dataService.searchBlogs(filtered, searchQuery);
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, blogsData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const category = blogsData?.categories?.find((cat: any) => cat.name === categoryName);
    return category?.color || 'primary';
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

  if (!blogsData) {
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
                  Code201 Blogs
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, tips, and stories from the coding community
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {blogsData.categories?.map((category: any) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                {/* Featured Posts */}
                {filteredPosts.some((post: any) => post.featured) && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                      <Star className="h-6 w-6 text-wisdom-gold fill-wisdom-gold" />
                      Featured Posts
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredPosts
                        .filter((post: any) => post.featured)
                        .map((post: any) => (
                          <Card key={post.id} className="hover:shadow-lg transition-all duration-300 border-border/40 bg-gradient-to-br from-wisdom-gold/5 to-transparent">
                            <CardHeader>
                              <div className="flex items-center justify-between mb-2">
                                <Badge className={`bg-${getCategoryColor(post.category)}/10 text-${getCategoryColor(post.category)} border-${getCategoryColor(post.category)}/20`}>
                                  {post.category}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(post.date)}
                                </div>
                              </div>
                              <CardTitle 
                                className="text-xl hover:text-primary transition-colors cursor-pointer"
                                onClick={() => setSelectedBlog(post)}
                              >
                                {post.title}
                              </CardTitle>
                              <CardDescription className="text-base">{post.excerpt}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {post.author}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {post.readTime}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-4">
                                <Button size="sm" onClick={() => setSelectedBlog(post)}>Read More</Button>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* All Posts */}
                <div>
                  <h2 className="text-2xl font-bold mb-8">
                    {selectedCategory === "All" ? "Latest Posts" : `${selectedCategory} Posts`}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts
                      .filter((post: any) => !post.featured)
                      .map((post: any) => (
                        <Card key={post.id} className="hover:shadow-lg transition-all duration-300 border-border/40">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={`bg-${getCategoryColor(post.category)}/10 text-${getCategoryColor(post.category)} border-${getCategoryColor(post.category)}/20`}>
                                {post.category}
                              </Badge>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.date)}
                              </div>
                            </div>
                            <CardTitle 
                              className="text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2"
                              onClick={() => setSelectedBlog(post)}
                            >
                              {post.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedBlog(post)}>Read More</Button>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Categories Overview */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
              <p className="text-lg text-muted-foreground">
                Discover content tailored to your interests
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {blogsData.categories?.map((category: any) => (
                <Card 
                  key={category.name} 
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-border/40 ${
                    selectedCategory === category.name ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardHeader className="text-center p-4">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.count} posts</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {selectedBlog && (
          <BlogReader 
            blog={selectedBlog} 
            onClose={() => setSelectedBlog(null)} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Blogs;