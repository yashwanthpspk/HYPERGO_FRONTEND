export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  areaSqFt?: number;
  location?: string;
  city?: string;
  state?: string;
  status?: string;
  features?: string[];
  amenities?: string;
  furnished?: string;
  availableFrom?: string;
  listedBy?: string;
  tags?: string;
  colorTheme?: string;
  rating?: number;
  isVerified?: boolean;
  listingType?: string;
}
