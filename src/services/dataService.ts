interface CacheData {
  data: any;
  timestamp: number;
  expires: number;
}

class DataService {
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

  async fetchData(endpoint: string): Promise<any> {
    const cacheKey = `codeveda_${endpoint}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`/data/${endpoint}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      
      const data = await response.json();
      this.saveToCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      // Return cached data even if expired as fallback
      const expiredCache = localStorage.getItem(cacheKey);
      if (expiredCache) {
        return JSON.parse(expiredCache).data;
      }
      throw error;
    }
  }

  private getFromCache(key: string): any | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsedCache: CacheData = JSON.parse(cached);
    const now = Date.now();

    if (now > parsedCache.expires) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedCache.data;
  }

  private saveToCache(key: string, data: any): void {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + this.cacheExpiry
    };

    try {
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  clearCache(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('codeveda_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Blog-specific methods
  async getBlogPosts(): Promise<any> {
    return this.fetchData('blogs');
  }

  searchBlogs(posts: any[], query: string): any[] {
    if (!query.trim()) return posts;
    
    const searchTerm = query.toLowerCase();
    return posts.filter((post: any) => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
      post.category.toLowerCase().includes(searchTerm)
    );
  }

  filterBlogsByCategory(posts: any[], category: string): any[] {
    if (!category || category === 'All') return posts;
    return posts.filter((post: any) => post.category === category);
  }
}

export const dataService = new DataService();