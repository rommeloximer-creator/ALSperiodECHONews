export enum Category {
  HEADLINE = 'Headline',
  NEWS = 'News',
  LIFESTYLE = 'Lifestyle/Feature',
  EDITORIAL = 'Editorial',
  SPORTS = 'Sports and Health',
  SCIENCE = 'Science and Technology',
  ENTERTAINMENT = 'Entertainment',
  LIVELIHOOD = 'Livelihood',
  SUCCESS = 'Success Stories',
  LITERATURE = 'Literature'
}

export interface Article {
  id: string;
  title: string;
  category: string; 
  image?: string;     
  images?: string[];  
  content: string;
  excerpt?: string;
  author: string;
  createdAt: any;     
  views?: number;     
  likes?: number;     
  isFeatured?: boolean;
}

export interface SiteSettings {
  title: string;
  subtitle: string;
  tagline: string;
  bannerUrl: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  heroImage?: string; 
  heroDescription: string;
  useStaticHero: boolean;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
}
