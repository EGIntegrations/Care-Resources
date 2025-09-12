const API_BASE_URL = 'https://3hggeubhb5.execute-api.us-east-1.amazonaws.com/prod';

export interface Video {
  id: string;
  title: string;
  url: string;
  thumb: string;
  duration: string;
  category: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  avatar: string;
  phone: string;
  email: string;
  department: string;
}

export interface Pathway {
  id: string;
  title: string;
  color: string;
  icon: string;
  description: string;
}

class ApiService {
  private cache: Map<string, { data: any[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private async fetchData<T>(endpoint: string, useCache: boolean = true): Promise<T[]> {
    // Check cache first
    if (useCache) {
      const cached = this.cache.get(endpoint);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data as T[];
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Parse Lambda response format
      let transformedData;
      if (data.body) {
        const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        transformedData = this.transformApiData(parsedBody, endpoint);
      } else {
        transformedData = this.transformApiData(data, endpoint);
      }
      
      // Cache the result
      this.cache.set(endpoint, {
        data: transformedData,
        timestamp: Date.now()
      });
      
      return transformedData;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  private transformApiData<T>(data: any[], endpoint: string): T[] {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => {
      if (endpoint === '/videos') {
        return {
          id: item['expat-videos'] || item.id || 'unknown',
          title: item.title || 'Untitled',
          url: item.url || '',
          thumb: item.thumb || 'https://picsum.photos/300/200?random=1',
          duration: item.duration || '0:00',
          category: item.category || 'General',
          description: item.description || ''
        } as T;
      }
      
      if (endpoint === '/contacts') {
        return {
          id: item['expat-contacts'] || item.id || 'unknown',
          name: item.name || 'Unknown',
          title: item.title || 'Staff Member',
          avatar: item.avatar || 'https://picsum.photos/100/100?random=1',
          phone: item.phone || '',
          email: item.email || '',
          department: item.department || 'General'
        } as T;
      }
      
      if (endpoint === '/pathways') {
        return {
          id: item['expat-pathways'] || item.id || 'unknown',
          title: item.title || item.name || 'Pathway',
          color: item.color || '#2160DC',
          icon: item.icon || 'help-circle',
          description: item.description || '',
          name: item.name || item.title || 'Pathway',
          faqs: item.faqs || [],
          contact: item.contact || null
        } as T;
      }
      
      return item as T;
    });
  }

  async getVideos(): Promise<Video[]> {
    return this.fetchData<Video>('/videos');
  }

  async getContacts(): Promise<Contact[]> {
    return this.fetchData<Contact>('/contacts');
  }

  async getPathways(): Promise<Pathway[]> {
    return this.fetchData<Pathway>('/pathways');
  }
}

export const apiService = new ApiService();