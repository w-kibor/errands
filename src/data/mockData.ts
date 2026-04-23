import { Order, Rider, Message } from '../types';

export const mockRider: Rider = {
  id: 'r1',
  name: 'Samuel O.',
  phone: '+234 800 000 0000',
  rating: 4.8,
  vehicle: 'Honda CG125 (Motorcycle)',
  avatar:
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  lat: 6.5244,
  lng: 3.3792
};

export const mockOrders: Order[] = [
{
  id: 'ORD-8472',
  date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  pickup: { address: 'Victoria Island, Lagos' },
  dropoff: { address: 'Lekki Phase 1, Lagos' },
  packageType: 'Document',
  urgency: 'Normal',
  status: 'Delivered',
  price: 1500,
  rider: mockRider
},
{
  id: 'ORD-9102',
  date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  pickup: { address: 'Ikeja City Mall' },
  dropoff: { address: 'Yaba, Lagos' },
  packageType: 'Medium Box',
  urgency: 'Express',
  status: 'Delivered',
  price: 3200,
  rider: mockRider
}];


export const mockMessages: Message[] = [
{
  id: 'm1',
  senderId: 'r1',
  text: 'Hello! I have picked up your package.',
  timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  isRider: true
},
{
  id: 'm2',
  senderId: 'u1',
  text: 'Great, thanks! How long until you arrive?',
  timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  isRider: false
},
{
  id: 'm3',
  senderId: 'r1',
  text: 'I should be there in about 15 minutes. Traffic is light.',
  timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  isRider: true
}];