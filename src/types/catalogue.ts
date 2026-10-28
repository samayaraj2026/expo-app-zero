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

export interface ProductVariant {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  productCode: string;
  size?: string;
  weight?: string;
  colour?: string;
  sheetsPerReam?: number | string;
}

export interface ProductDetailsData {
  id: string;
  name: string;
  category: string;
  supplier: string;
  supplierUrl?: string;
  rating: number;
  ratingCount: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  inStock: boolean;
  deliveryEstimate: string;
  about: string;
  variants: ProductVariant[];
  details: {
    productCode: string;
    size: string;
    weight: string;
    colour: string;
    sheetsPerReam: string | number;
  };
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
export interface VariantCardProps {
  variant: ProductVariant;
  isSelected: boolean;
  currency?: string;
  onSelect: (variant: ProductVariant) => void;
}

export type { SupplierDetailsData, SupplierRatingBreakdown } from "@/constants/supplier";
