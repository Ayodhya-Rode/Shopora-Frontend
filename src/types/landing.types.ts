export interface LandingProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating?: number;
  imageUrl: string;
}

export interface LandingCategory {
  id: string;
  name: "Women" | "Men" | "Kids";
  imageUrl: string;
}