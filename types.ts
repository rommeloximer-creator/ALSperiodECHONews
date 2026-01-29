
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
  image?: string;     // Added this to fix "Property image does not exist"
  images?: string[];  
  content: string;
  author: string;
  createdAt: any;     // Changed to 'any' to stop the "incompatible type" error
  views?: number;     // Added this to fix "Property views does not exist"
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
  heroImage?: string; // New property for custom override
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
