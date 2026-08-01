import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Navigation, Battery, Clock, Phone, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import { fetchAdminDispatch, AdminOrder } from '../lib/api';

// Fix leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const riderIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultNairobiRiders = [
  {
    id: 'r1',
    name: 'Mike Smith (Rider)',
    lat: -1.286389,
    lng: 36.817223,
    status: 'In Transit',
    battery: 85,
    speed: '25 km/h',
    eta: '10 mins',
    phone: '+254 712 345 678'
  },
  {
    id: 'r2',
    name: 'Sarah Davis (Runner)',
    lat: -1.2683,
    lng: 36.8111,
    status: 'Available',
    battery: 92,
    speed: '0 km/h',
    eta: '-',
    phone: '+254 722 345 679'
  },
  {
    id: 'r3',
    name: 'John Doe (Rider)',
    lat: -1.2921,
    lng: 36.8219,
    status: 'Picked Up',
    battery: 45,
    speed: '15 km/h',
    eta: '25 mins',
    phone: '+254 733 345 680'
  }
];

export function DispatchMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOrders, setActiveOrders] = useState<AdminOrder[]>([]);
  const [onlineRiders, setOnlineRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDispatchData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminDispatch();
      setActiveOrders(data.activeOrders);
      setOnlineRiders(data.onlineRiders);
    } catch (err) {
      console.error('Error fetching dispatch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadDispatchData();
  }, []);

  if (!isMounted) return null;

  const displayRiders = onlineRiders.length > 0
    ? onlineRiders.map((r, i) => ({
        id: r.id || `r-${i}`,
        name: r.name || 'Runner',
        lat: r.lat || (-1.286389 + (i * 0.005)),
        lng: r.lng || (36.817223 + (i * 0.005)),
        status: r.status || 'Available',
        battery: r.battery || 90,
        speed: '18 km/h',
        eta: '12 mins',
        phone: r.phone || '+254 700 000 000'
      }))
    : defaultNairobiRiders;

  const filteredRiders = displayRiders.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle>Smart Dispatch</CardTitle>
              <Button size="sm" variant="ghost" onClick={loadDispatchData}>
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search riders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-slate-100">
              {filteredRiders.map((rider) => (
                <div
                  key={rider.id}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{rider.name}</span>
                    <Badge variant={rider.status === 'Available' ? 'success' : 'secondary'}>
                      {rider.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Battery className="h-3 w-3" /> {rider.battery}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" /> {rider.speed}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {rider.eta}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {rider.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
        <MapContainer
          center={[-1.286389, 36.817223]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Nairobi CBD Demand Hotspot */}
          <Circle
            center={[-1.286389, 36.817223]}
            radius={800}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.15 }}
          />

          {filteredRiders.map((rider) => (
            <Marker key={rider.id} position={[rider.lat, rider.lng]} icon={riderIcon}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold mb-1">{rider.name}</div>
                  <div className="text-sm text-slate-600 mb-2">{rider.status}</div>
                  <div className="text-xs space-y-1">
                    <div>Speed: {rider.speed}</div>
                    <div>ETA: {rider.eta}</div>
                    <div>Battery: {rider.battery}%</div>
                    <div>Phone: {rider.phone}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}