export type PageRoute =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'technology'
  | 'about'
  | 'contact';

export type ProductModelType = 'x1' | 'pro-studio' | 'air-mini' | 'chronos-watch' | 'audio-sphere';

export type HeroObjectFocus = 'all' | 'x1' | 'chronos-watch' | 'audio-sphere';

export interface ProductColorVariant {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  metalness: number;
  roughness: number;
}

export interface ProductHotspot {
  id: string;
  label: string;
  title: string;
  description: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
}

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  modelType: ProductModelType;
  name: string;
  category:
    | 'Over-Ear Wireless'
    | 'Open-Back Reference'
    | 'In-Ear Monitors'
    | 'Timepieces & Wearables';
  tagline: string;
  shortDescription: string;
  description: string;
  price: number;
  availability: 'In Stock' | 'Limited Allocation';
  imageUrl: string;
  variants: ProductColorVariant[];
  specs: ProductSpecItem[];
  highlights: { title: string; metric: string; detail: string }[];
  hotspots: ProductHotspot[];
  comparison: {
    driver: string;
    anc: string;
    battery: string;
    codec: string;
    weight: string;
    materials: string;
    response: string;
  };
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface DemoOrderResponse {
  orderNumber: string;
  status: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  note: string;
}

export interface ContactSubmissionResponse {
  referenceId: string;
  receivedAt: string;
  message: string;
}
