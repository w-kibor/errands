export type User = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
};

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