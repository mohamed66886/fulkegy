import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  image: string;
  logo?: string;
  technologies: string[];
  projectUrl: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: string[];
  createdAt: Timestamp;
}

export interface Employee {
  id: string;
  name: string;
  nameAr: string;
  position: string;
  positionAr: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'admin' | 'developer' | 'designer' | 'manager';
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  read: boolean;
  archived: boolean;
  reply?: string;
  createdAt: Timestamp;
}

export interface BlogPost {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  content: string;
  contentAr: string;
  coverImage: string;
  tags: string[];
  author: string;
  publishDate: Timestamp;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor';
  createdAt: Timestamp;
}

export interface DashboardStats {
  totalProjects: number;
  totalClients: number;
  totalMessages: number;
  totalEmployees: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp;
}
