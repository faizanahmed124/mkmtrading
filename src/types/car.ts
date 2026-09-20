export type Car = {
  id: string;
  created_at: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  fuel_type: string | null;
  transmission: string | null;
  color: string | null;
  condition: "New" | "Used" | string;
  description: string | null;
  images: string[] | null;
  featured: boolean;
};

export type SiteSettings = {
  id: string;
  shop_name: string;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  map_url: string | null;
  latitude: number | null;
  longitude: number | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  logo_url: string | null;
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_subtext: string | null;
  about_tagline: string | null;
  about_paragraph: string | null;
  about_image_url: string | null;
};