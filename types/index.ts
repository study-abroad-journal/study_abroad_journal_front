export interface User {
  id: string;
  email: string;
  name: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  weather?: string;
  aiCorrection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}