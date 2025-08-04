import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import Layout from "@/components/Layout";
import HeroSection from "@/components/ui/hero-section";
import HighlightsGrid from "@/components/ui/highlights-grid";
import SocialLinks from "@/components/ui/social-links";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataService.fetchData('home');
        setHomeData(data);
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCtaClick = () => {
    navigate('/contact');
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

  if (!homeData) {
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
      <HeroSection
        title={homeData.hero.title}
        tagline={homeData.hero.tagline}
        description={homeData.hero.description}
        cta={homeData.hero.cta}
        onCtaClick={handleCtaClick}
      />
      <HighlightsGrid highlights={homeData.highlights} />
      <SocialLinks socialLinks={homeData.socialLinks} />
    </Layout>
  );
};

export default Home;