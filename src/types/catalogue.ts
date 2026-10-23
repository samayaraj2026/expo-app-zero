export interface Product {
  id: string;
  name: string;
  category: string;
  packageInfo: string;
  supplier: string;
  price: number;
  currency: string;
  imageUrl?: string;
  rating?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CatalogueSection {
  id: string;
  title: string;
  products: Product[];
}

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  initialQuantity?: number;
}

export interface ProductRowCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  initialQuantity?: number;
}

export interface ProductSectionProps {
  title: string;
  products: Product[];
  onSeeAll?: () => void;
  onProductPress?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}
