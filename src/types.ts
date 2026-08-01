export type User = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  isRunner?: boolean;
  runnerProfile?: RunnerProfile;
};

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isPrimary: boolean;
}

export type PaymentMethodType = 'M-Pesa' | 'Card' | 'Cash on Delivery';

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  details: string;
  isDefault: boolean;
}

export type ServiceType =
  | 'CBD Batch Delivery'
  | 'Personal Shopping'
  | 'Parcel Pickup and Drop Off'
  | 'Shop Legitimacy Verification'
  | 'Custom Task Requests'
  | 'Dedicated Business Errands Support';

export type PackageType =
'Document' |
'Small Box' |
'Medium Box' |
'Large Box' |
'Fragile';
export type UrgencyType = 'Normal' | 'Express';
export type OrderStatus =
'Pending' |
'Rider Assigned' |
'Picking Up' |
'En Route' |
'Delivered' |
'Cancelled';

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  date: string;
  pickup: Location;
  dropoff: Location;
  packageType: PackageType;
  urgency: UrgencyType;
  status: OrderStatus;
  price: number;
  rider?: Rider;
  note?: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  avatar: string;
  lat: number;
  lng: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRider: boolean;
}

export interface DraftOrder {
  pickup: Location;
  dropoff: Location;
  packageType: PackageType;
  urgency: UrgencyType;
  note?: string;
  price?: number;
}

export interface ServiceDefinition {
  id: string;
  name: ServiceType;
  description: string;
  requiresPickup: boolean;
  requiresDropoff: boolean;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: ServiceType;
  customerId: string;
  createdAt: string;
  pickup?: Location;
  dropoff?: Location;
  businessName?: string;
  instructions: string;
  urgency: UrgencyType;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface RunnerProfile {
  vehicleType: string;
  coverageArea: string;
  capabilities: ServiceType[];
  verified: boolean;
}

export type BusinessRole = 'OWNER_ADMIN' | 'MANAGER_DISPATCHER' | 'STAFF_REQUESTER';

export interface BusinessProfile {
  id: string;
  name: string;
  taxId?: string;
  email: string;
  phone: string;
  website?: string;
  logoUrl?: string;
  createdAt: string;
  wallet?: CorporateWallet;
  branches?: Branch[];
  costCenters?: CostCenter[];
  _count?: {
    members: number;
    orders: number;
    bulkBatches: number;
  };
}

export interface TeamMember {
  id: string;
  businessId: string;
  userId: string;
  role: BusinessRole;
  branchId?: string;
  title?: string;
  isActive: boolean;
  user?: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    avatar?: string;
  };
  branch?: Branch;
}

export interface Branch {
  id: string;
  businessId: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  isPrimary: boolean;
}

export interface CorporateWallet {
  id: string;
  businessId: string;
  balance: number;
  currency: string;
  transactions?: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'TOPUP' | 'ERRAND_DEPOSIT' | 'ERRAND_DEDUCTION' | 'REFUND' | 'ADJUSTMENT';
  description: string;
  referenceId?: string;
  costCenterId?: string;
  costCenter?: CostCenter;
  createdAt: string;
}

export interface CostCenter {
  id: string;
  businessId: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface BulkErrandBatch {
  id: string;
  businessId: string;
  filename: string;
  totalItems: number;
  processedItems: number;
  successItems: number;
  failedItems: number;
  status: 'PENDING' | 'VALIDATING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}