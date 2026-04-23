export type User = {
  id: string;
  name: string;
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