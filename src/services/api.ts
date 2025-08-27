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
  private async fetchData<T>(endpoint: string): Promise<T[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Parse Lambda response format
      if (data.body) {
        const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        return this.transformApiData(parsedBody, endpoint);
      }
      
      return this.transformApiData(data, endpoint);
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
          title: item.title || 'Pathway',
          color: item.color || '#2160DC',
          icon: item.icon || 'help-circle',
          description: item.description || ''
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