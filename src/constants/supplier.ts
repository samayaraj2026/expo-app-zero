import type { Product } from "@/types/catalogue";

export interface SupplierRatingBreakdown {
  stars: number;
  percentage: number;
}

export interface SupplierDetailsData {
  id: string;
  name: string;
  verified: boolean;
  location: string;
  productCount: number;
  onTimeDeliveryRate: number;
  categories: string;
  email: string;
  phone: string;
  website: string;
  rating: number;
  ratingCount: string;
  ratingBreakdown: SupplierRatingBreakdown[];
  productsCount: number;
  categoryFilters: string[];
  products: Product[];
}

export const DEFAULT_SUPPLIER: SupplierDetailsData = {
  id: "canal-office-supplies",
  name: "Canal Office Supplies",
  verified: true,
  location: "Leeds · UK wide",
  productCount: 410,
  onTimeDeliveryRate: 98,
  categories: "Stationery, Print",
  email: "orders@canalsupplies.co.uk",
  phone: "020 7946 0123",
  website: "vrptelematics.co.uk",
  rating: 4.3,
  ratingCount: "1,550 ratings",
  ratingBreakdown: [
    { stars: 5, percentage: 82 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ],
  productsCount: 214,
  categoryFilters: ["Stationery", "Packaging", "Safety"],
  products: [
    {
      id: "ord-1",
      name: "A4 copier paper, 80gsm",
      category: "Stationery",
      packageInfo: "Pack of 5 reams",
      supplier: "Canal Office Supplies",
      price: 10.5,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-2",
      name: "A4 copier paper, 80gsm",
      category: "Stationery",
      packageInfo: "Pack of 5 reams",
      supplier: "Canal Office Supplies",
      price: 10.5,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-3",
      name: "A4 copier paper, 80gsm",
      category: "Stationery",
      packageInfo: "Pack of 5 reams",
      supplier: "Canal Office Supplies",
      price: 10.5,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-4",
      name: "A4 copier paper, 80gsm",
      category: "Stationery",
      packageInfo: "Pack of 5 reams",
      supplier: "Canal Office Supplies",
      price: 10.5,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-5",
      name: "A4 copier paper, 80gsm",
      category: "Stationery",
      packageInfo: "Pack of 5 reams",
      supplier: "Canal Office Supplies",
      price: 10.5,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-6",
      name: "Ballpoint Pens Black Medium",
      category: "Stationery",
      packageInfo: "Box of 50",
      supplier: "Canal Office Supplies",
      price: 6.99,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-7",
      name: "Heavy Duty Packaging Tape",
      category: "Packaging",
      packageInfo: "Pack of 6 rolls",
      supplier: "Canal Office Supplies",
      price: 8.5,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-8",
      name: "Yellow Sticky Notes 76x76mm",
      category: "Stationery",
      packageInfo: "Pack of 12 pads",
      supplier: "Canal Office Supplies",
      price: 5.25,
      currency: "£",
      inStock: true,
    },
    {
      id: "ord-9",
      name: "Safety Glasses Clear Anti-Fog",
      category: "Safety",
      packageInfo: "Pack of 5",
      supplier: "Canal Office Supplies",
      price: 11.2,
      currency: "£",
      inStock: true,
    },
  ],
};

export function getSupplierDetails(supplierName?: string): SupplierDetailsData {
  if (!supplierName || supplierName === DEFAULT_SUPPLIER.name) {
    return DEFAULT_SUPPLIER;
  }

  return {
    ...DEFAULT_SUPPLIER,
    id: supplierName.toLowerCase().replace(/\s+/g, "-"),
    name: supplierName,
    products: DEFAULT_SUPPLIER.products.map((p) => ({
      ...p,
      supplier: supplierName,
    })),
  };
}
