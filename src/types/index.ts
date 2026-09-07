export interface WorkspaceType {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  _id: string;
  name: string;
  city: string;
  state?: string;
  area?: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  workspaceType: WorkspaceType | string;
  description?: string;
  price: number;
  pricingPeriod?: string;
  capacity: number;
  sqft?: number;
  callNumber?: string;
  whatsappNumber?: string;
  amenities?: string[];
  imageUrl?: string;
  images?: string[];
  available: boolean;
  location?: Location | string;
  approvalStatus?: string;
  createdBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
