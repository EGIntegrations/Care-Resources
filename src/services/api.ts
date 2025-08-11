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
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
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