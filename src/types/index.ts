export interface Video {
  id: string;
  title: string;
  thumb: string;
  url: string;
  duration: string;
  description?: string;
  category?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  avatar: string;
  phone: string;
  email: string;
  department?: string;
}

export interface Pathway {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  faqs: FAQ[];
  contact?: Contact;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
}

export interface Settings {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  contactsUnlocked: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  biometricSupported: boolean;
  biometricEnabled: boolean;
}

export const SHARED_PASSCODE = 'CARE2025';