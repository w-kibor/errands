import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import {
  Search,
  Filter,
  MoreHorizontal,
  Bus,
  MapPin,
  Truck,
  Bike,
  Car,
  Package,
  Store,
  GitMerge,
  Plus,
  ArrowRight,
  Check,
  Star,
  Phone,
  Bell,
  Smartphone,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import {
  fetchAdminServiceRequests,
  updateServiceRequestStatus,
  assignRunnerToServiceRequest,
  fetchAdminFleet,
  AdminServiceRequest,
  FleetMember
} from '../lib/api';

const deliveryMethods = [
{ name: 'Internal Rider', icon: Bike, active: 84, color: 'text-blue-600' },
{ name: 'Internal Runner', icon: Truck, active: 41, color: 'text-indigo-600' },
{ name: 'Bolt Delivery', icon: Car, active: 22, color: 'text-emerald-600' },
{ name: 'Uber Delivery', icon: Car, active: 18, color: 'text-slate-800' },
{ name: 'Matatu SACCO', icon: Bus, active: 37, color: 'text-amber-600' },
{ name: 'Bus Parcel', icon: Bus, active: 15, color: 'text-orange-600' },
{ name: 'Courier Company', icon: Package, active: 9, color: 'text-purple-600' },
{ name: 'Self Pickup', icon: Store, active: 12, color: 'text-teal-600' }];


const methodDeliveries = [
{ id: 'DEL-4471', method: 'Matatu SACCO', provider: 'Easy Coach', eta: '4h 10m', status: 'In Transit', cost: 850, customer: 'Alice Johnson', tracking: 'EC-9921-KSM' },
{ id: 'DEL-4472', method: 'Bolt Delivery', provider: 'Bolt', eta: '18 min', status: 'Rider En Route', cost: 320, customer: 'Bob Williams', tracking: 'BLT-77213' },
{ id: 'DEL-4473', method: 'Internal Rider', provider: 'Mike Smith', eta: '25 min', status: 'Picked Up', cost: 250, customer: 'Charlie Brown', tracking: 'INT-33120' },
{ id: 'DEL-4474', method: 'Courier Company', provider: 'G4S Courier', eta: '1 day', status: 'Booked', cost: 600, customer: 'Diana Prince', tracking: 'G4S-88231' },
{ id: 'DEL-4475', method: 'Bus Parcel', provider: 'Guardian Angel', eta: '5h 30m', status: 'Handed to Provider', cost: 450, customer: 'Evan Wright', tracking: 'GA-1290-NKR' },
{ id: 'DEL-4476', method: 'Self Pickup', provider: '—', eta: 'Awaiting', status: 'Ready for Pickup', cost: 0, customer: 'Fiona Gallagher', tracking: 'SP-00412' },
{ id: 'DEL-4477', method: 'Uber Delivery', provider: 'Uber', eta: '22 min', status: 'Rider En Route', cost: 340, customer: 'George Otieno', tracking: 'UBR-55190' }];


const costRows = [
{ id: 'DSP-8921', provider: 'Easy Coach', providerCharge: 550, serviceFee: 150, pickupFee: 80, lastMileFee: 200, payout: 0, total: 980 },
{ id: 'DSP-8922', provider: 'Super Metro', providerCharge: 150, serviceFee: 60, pickupFee: 40, lastMileFee: 0, payout: 0, total: 250 },
{ id: 'DSP-8923', provider: 'Modern Coast', providerCharge: 800, serviceFee: 200, pickupFee: 100, lastMileFee: 250, payout: 220, total: 1350 },
{ id: 'DSP-8924', provider: 'Ena Coach', providerCharge: 600, serviceFee: 150, pickupFee: 80, lastMileFee: 180, payout: 160, total: 1010 },
{ id: 'DSP-8925', provider: 'Bolt', providerCharge: 260, serviceFee: 60, pickupFee: 0, lastMileFee: 0, payout: 0, total: 320 }];


const providerPerformance = [
{ name: 'Easy Coach', total: 1240, success: 1198, delays: 34, lost: 8, avgTime: '6h 20m', rating: 4.6, revenue: 980000, topRoute: 'NBO → Kisumu' },
{ name: 'Modern Coast', total: 890, success: 861, delays: 22, lost: 7, avgTime: '8h 05m', rating: 4.3, revenue: 1120000, topRoute: 'NBO → Mombasa' },
{ name: 'Super Metro', total: 2100, success: 2072, delays: 26, lost: 2, avgTime: '2h 40m', rating: 4.8, revenue: 640000, topRoute: 'NBO → Nakuru' },
{ name: 'Ena Coach', total: 760, success: 731, delays: 25, lost: 4, avgTime: '5h 55m', rating: 4.5, revenue: 520000, topRoute: 'NBO → Kisii' },
{ name: 'Guardian Angel', total: 540, success: 502, delays: 31, lost: 7, avgTime: '5h 10m', rating: 4.1, revenue: 410000, topRoute: 'NBO → Eldoret' }];


const profitByProvider = providerPerformance.map((p) => ({
  name: p.name.split(' ')[0],
  profit: Math.round(p.revenue * 0.2)
}));

const notificationRules = [
{ key: 'booked', label: 'Parcel booked', push: true, sms: true },
{ key: 'handed', label: 'Handed to SACCO', push: true, sms: true },
{ key: 'departed', label: 'Vehicle departed', push: true, sms: false },
{ key: 'arrived', label: 'Vehicle arrived', push: true, sms: true },
{ key: 'ready', label: 'Parcel ready for pickup', push: true, sms: true },
{ key: 'assigned', label: 'Last-mile rider assigned', push: true, sms: false },
{ key: 'completed', label: 'Delivery completed', push: true, sms: true }];


type Leg = {
  label: string;
  party: string;
  phone: string;
  location: string;
  time: string;
  state: 'done' | 'active' | 'pending';
};

const multiLegShipments: {
  id: string;
  route: string;
  customer: string;
  provider: string;
  legs: Leg[];
}[] = [
{
  id: 'MLG-2201',
  route: 'Nairobi → Kisumu',
  customer: 'Alice Johnson',
  provider: 'Easy Coach',
  legs: [
  { label: 'Runner collects parcel', party: 'James Mwangi (Runner)', phone: '+254 712 445 001', location: 'Westlands, Nairobi', time: '08:12', state: 'done' },
  { label: 'Booked on Easy Coach', party: 'Easy Coach — River Rd Office', phone: '+254 733 220 118', location: 'River Road Terminal', time: '08:40', state: 'done' },
  { label: 'In transit to Kisumu', party: 'Bus KDA 214X', phone: '+254 799 010 222', location: 'A104 Highway', time: '09:05', state: 'active' },
  { label: 'Arrived at Kisumu terminal', party: 'Easy Coach — Kisumu Office', phone: '+254 733 220 440', location: 'Kisumu Terminal', time: '—', state: 'pending' },
  { label: 'Last-mile rider assigned', party: 'Brian Otieno (Rider)', phone: '+254 720 889 771', location: 'Kisumu CBD', time: '—', state: 'pending' },
  { label: 'Delivered to doorstep', party: 'Brian Otieno (Rider)', phone: '+254 720 889 771', location: 'Milimani, Kisumu', time: '—', state: 'pending' }]

},
{
  id: 'MLG-2202',
  route: 'Nairobi → Mombasa',
  customer: 'Charlie Brown',
  provider: 'Modern Coast',
  legs: [
  { label: 'Runner collects parcel', party: 'Peter Kariuki (Runner)', phone: '+254 712 445 118', location: 'CBD, Nairobi', time: '07:20', state: 'done' },
  { label: 'Booked on Modern Coast', party: 'Modern Coast — Accra Rd', phone: '+254 733 550 900', location: 'Accra Road Terminal', time: '07:55', state: 'done' },
  { label: 'In transit to Mombasa', party: 'Bus KDG 771B', phone: '+254 799 331 020', location: 'Mtito Andei', time: '11:30', state: 'done' },
  { label: 'Arrived at Mombasa terminal', party: 'Modern Coast — Mombasa', phone: '+254 733 550 220', location: 'Mombasa Terminal', time: '15:10', state: 'active' },
  { label: 'Last-mile rider assigned', party: 'Ali Hassan (Rider)', phone: '+254 720 004 551', location: 'Nyali', time: '—', state: 'pending' },
  { label: 'Delivered to doorstep', party: 'Ali Hassan (Rider)', phone: '+254 720 004 551', location: 'Nyali, Mombasa', time: '—', state: 'pending' }]

},
{
  id: 'MLG-2203',
  route: 'Nairobi → Nakuru',
  customer: 'Diana Prince',
  provider: 'Super Metro',
  legs: [
  { label: 'Runner collects parcel', party: 'Grace Njeri (Runner)', phone: '+254 712 445 330', location: 'Kilimani, Nairobi', time: '10:02', state: 'done' },
  { label: 'Booked on Super Metro', party: 'Super Metro — Afya Centre', phone: '+254 733 118 004', location: 'Afya Centre Terminal', time: '10:25', state: 'done' },
  { label: 'In transit to Nakuru', party: 'Bus KDC 902M', phone: '+254 799 552 118', location: 'Naivasha', time: '11:40', state: 'done' },
  { label: 'Arrived at Nakuru terminal', party: 'Super Metro — Nakuru', phone: '+254 733 118 550', location: 'Nakuru Terminal', time: '12:35', state: 'done' },
  { label: 'Last-mile rider assigned', party: 'Kevin Kiptoo (Rider)', phone: '+254 720 771 330', location: 'Nakuru CBD', time: '12:50', state: 'active' },
  { label: 'Delivered to doorstep', party: 'Kevin Kiptoo (Rider)', phone: '+254 720 771 330', location: 'Section 58, Nakuru', time: '—', state: 'pending' }]

}];

const mockSaccos = [
{
  id: 'SAC-001',
  name: 'Super Metro',
  routes: 'Nairobi, Kikuyu, Thika',
  terminals: 4,
  status: 'Active',
  rating: 4.8
},
{
  id: 'SAC-002',
  name: 'Easy Coach',
  routes: 'Nairobi, Kisumu, Eldoret',
  terminals: 12,
  status: 'Active',
  rating: 4.5
},
{
  id: 'SAC-003',
  name: 'Modern Coast',
  routes: 'Nairobi, Mombasa, Kampala',
  terminals: 8,
  status: 'Active',
  rating: 4.2
},
{
  id: 'SAC-004',
  name: 'Ena Coach',
  routes: 'Nairobi, Kisii, Migori',
  terminals: 6,
  status: 'Active',
  rating: 4.6
},
{
  id: 'SAC-005',
  name: 'North Rift Shuttle',
  routes: 'Nairobi, Eldoret, Kitale',
  terminals: 5,
  status: 'Inactive',
  rating: 3.9
}];

const mockDispatch = [
{
  id: 'DSP-8921',
  provider: 'Easy Coach',
  destination: 'Kisumu',
  tracking: 'EC-9921-KSM',
  status: 'In Transit',
  cost: 850,
  customer: 'Alice Johnson'
},
{
  id: 'DSP-8922',
  provider: 'Super Metro',
  destination: 'Thika',
  tracking: 'SM-4412-THK',
  status: 'Arrived at Destination Terminal',
  cost: 250,
  customer: 'Bob Williams'
},
{
  id: 'DSP-8923',
  provider: 'Modern Coast',
  destination: 'Mombasa',
  tracking: 'MC-7734-MSA',
  status: 'Booked',
  cost: 1200,
  customer: 'Charlie Brown'
},
{
  id: 'DSP-8924',
  provider: 'Ena Coach',
  destination: 'Kisii',
  tracking: 'EN-1123-KSI',
  status: 'Completed',
  cost: 900,
  customer: 'Diana Prince'
}];

const mockRoutes = [
{
  id: 'RT-01',
  origin: 'Nairobi',
  destination: 'Kisumu',
  providers: ['Easy Coach', 'Guardian Angel'],
  avgTime: '6h 30m',
  baseCost: 800
},
{
  id: 'RT-02',
  origin: 'Nairobi',
  destination: 'Mombasa',
  providers: ['Modern Coast', 'Mash Poa'],
  avgTime: '8h 15m',
  baseCost: 1000
},
{
  id: 'RT-03',
  origin: 'Nairobi',
  destination: 'Nakuru',
  providers: ['Super Metro', 'Mololine'],
  avgTime: '2h 45m',
  baseCost: 400
},
{
  id: 'RT-04',
  origin: 'Nairobi',
  destination: 'Eldoret',
  providers: ['Easy Coach', 'North Rift Shuttle'],
  avgTime: '5h 45m',
  baseCost: 750
}];

export function Transport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [selectedShipment, setSelectedShipment] = useState(multiLegShipments[0].id);
  const [rules, setRules] = useState(notificationRules);
  const [serviceRequests, setServiceRequests] = useState<AdminServiceRequest[]>([]);
  const [fleet, setFleet] = useState<FleetMember[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      const [reqData, fleetData] = await Promise.all([
        fetchAdminServiceRequests(),
        fetchAdminFleet()
      ]);
      setServiceRequests(reqData.serviceRequests);
      setFleet(fleetData.fleet);
    } catch (err) {
      console.error('Error fetching service requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateServiceRequestStatus(id, status);
      loadRequests();
    } catch (err) {
      alert('Failed to update status: ' + (err as Error).message);
    }
  };

  const handleAssignRunner = async (id: string, runnerId: string) => {
    try {
      await assignRunnerToServiceRequest(id, runnerId);
      loadRequests();
    } catch (err) {
      alert('Failed to assign runner: ' + (err as Error).message);
    }
  };

  const toggleRule = (key: string, channel: 'push' | 'sms') =>
  setRules((prev) =>
  prev.map((r) => r.key === key ? { ...r, [channel]: !r[channel] } : r)
  );

  const visibleDeliveries =
  methodFilter === 'All' ?
  methodDeliveries :
  methodDeliveries.filter((d) => d.method === methodFilter);

  const shipment =
  multiLegShipments.find((s) => s.id === selectedShipment) ??
  multiLegShipments[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Transport & Third-Party
          </h1>
          <p className="text-sm text-slate-500">
            Manage SACCOs, external couriers, and custom service request errands.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadRequests} className="gap-1">
            <RefreshCw className={`h-4 w-4 ${loadingRequests ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Service Requests
            </CardTitle>
            <Bus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests.length}</div>
            <p className="text-xs text-slate-500">Custom business errands</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parcels In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-slate-500">Via 3rd party providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Multi-Leg Active
            </CardTitle>
            <GitMerge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-slate-500">Awaiting last-mile rider</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              3rd Party Spend (MTD)
            </CardTitle>
            <span className="text-sm font-bold text-green-600">KES</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425,000</div>
            <p className="text-xs text-slate-500">
              Platform profit: KES 85,000
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="requests">Live Service Requests</TabsTrigger>
          <TabsTrigger value="methods">Delivery Methods</TabsTrigger>
          <TabsTrigger value="dispatch">Parcel Dispatch</TabsTrigger>
          <TabsTrigger value="saccos">SACCO Directory</TabsTrigger>
          <TabsTrigger value="cost">Cost & Profit</TabsTrigger>
          <TabsTrigger value="performance">Provider Performance</TabsTrigger>
          <TabsTrigger value="routes">Route Management</TabsTrigger>
          <TabsTrigger value="multileg">Last-Mile Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Customer Custom Service Requests</CardTitle>
                <span className="text-xs text-slate-500">
                  Batch delivery, verification, dedicated errands
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Instructions / Details</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Assigned Runner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                        {loadingRequests ? 'Loading service requests...' : 'No service requests found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    serviceRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium text-blue-700">
                          {req.serviceName.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{req.customer?.name || 'Customer'}</div>
                          <div className="text-xs text-slate-500">{req.customer?.phone}</div>
                        </TableCell>
                        <TableCell className="max-w-[250px] text-xs text-slate-600 truncate">
                          {req.instructions || req.businessName || 'No special instructions'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={req.urgency === 'EXPRESS' ? 'destructive' : 'outline'}>
                            {req.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {req.assignedRunner ? (
                            <div>
                              <div className="font-medium">{req.assignedRunner.name}</div>
                              <div className="text-xs text-slate-500">{req.assignedRunner.phone}</div>
                            </div>
                          ) : (
                            <select
                              className="text-xs border rounded p-1 bg-amber-50 text-amber-900"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) handleAssignRunner(req.id, e.target.value);
                              }}
                            >
                              <option value="" disabled>Assign Runner...</option>
                              {fleet.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              req.status === 'COMPLETED' ? 'success' :
                              req.status === 'IN_PROGRESS' ? 'secondary' :
                              req.status === 'ASSIGNED' ? 'warning' : 'outline'
                            }
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <select
                            className="text-xs border rounded px-1.5 py-1 bg-white"
                            value={req.status}
                            onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {deliveryMethods.map((m) => {
              const active = methodFilter === m.name;
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() =>
                  setMethodFilter((prev) => prev === m.name ? 'All' : m.name)
                  }
                  aria-pressed={active}
                  className={
                  'flex items-center gap-3 rounded-xl border bg-white p-4 text-left transition-colors ' + (
                  active ?
                  'border-blue-600 ring-1 ring-blue-600' :
                  'border-slate-200 hover:bg-slate-50')
                  }>
                  
                  <m.icon className={'h-5 w-5 flex-shrink-0 ' + m.color} />
                  <div>
                    <div className="text-lg font-bold leading-none">
                      {m.active}
                    </div>
                    <div className="text-xs text-slate-500">{m.name}</div>
                  </div>
                </button>);

            })}
          </div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {methodFilter === 'All' ?
                  'All Active Deliveries' :
                  `${methodFilter} Deliveries`}
                </CardTitle>
                {methodFilter !== 'All' &&
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMethodFilter('All')}>
                  
                    Clear filter
                  </Button>
                }
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Tracking Ref</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleDeliveries.map((d) =>
                  <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.id}</TableCell>
                      <TableCell>{d.method}</TableCell>
                      <TableCell>{d.provider}</TableCell>
                      <TableCell>{d.customer}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {d.tracking}
                      </TableCell>
                      <TableCell>{d.eta}</TableCell>
                      <TableCell>
                        {d.cost === 0 ? '—' : `KES ${d.cost.toLocaleString()}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{d.status}</Badge>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispatch" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Active Third-Party Dispatches</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Search tracking or customer..."
                      className="pl-9" />
                    
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispatch ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Tracking Ref</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDispatch.map((item) =>
                  <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.provider}</TableCell>
                      <TableCell>{item.destination}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.tracking}
                      </TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>KES {item.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                        variant={
                        item.status === 'Completed' ?
                        'success' :
                        item.status === 'In Transit' ?
                        'secondary' :
                        item.status === 'Booked' ?
                        'outline' :
                        'warning'
                        }>
                        
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saccos" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Transport Providers & SACCOs</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider Name</TableHead>
                    <TableHead>Key Routes</TableHead>
                    <TableHead>Terminals</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSaccos.map((sacco) =>
                  <TableRow key={sacco.id}>
                      <TableCell className="font-medium">
                        {sacco.name}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {sacco.routes}
                      </TableCell>
                      <TableCell>{sacco.terminals}</TableCell>
                      <TableCell>{sacco.rating} / 5.0</TableCell>
                      <TableCell>
                        <Badge
                        variant={
                        sacco.status === 'Active' ?
                        'success' :
                        'destructive'
                        }>
                        
                          {sacco.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  3rd-Party Revenue (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES 3,670,000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Platform Profit (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  KES 734,000
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle>Cost Breakdown by Dispatch</CardTitle>
                <CardDescription>
                  Provider charge, fees, customer payment and platform profit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispatch</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Provider Charge</TableHead>
                      <TableHead>Service Fee</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Last-Mile</TableHead>
                      <TableHead>Payout</TableHead>
                      <TableHead>Customer Pays</TableHead>
                      <TableHead>Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costRows.map((r) => {
                      const profit =
                      r.total -
                      r.providerCharge -
                      r.pickupFee -
                      r.lastMileFee -
                      r.payout;
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.id}</TableCell>
                          <TableCell>{r.provider}</TableCell>
                          <TableCell>
                            KES {r.providerCharge.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            KES {r.serviceFee.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            KES {r.pickupFee.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            KES {r.lastMileFee.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            KES {r.payout.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            KES {r.total.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            KES {profit.toLocaleString()}
                          </TableCell>
                        </TableRow>);

                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profit by Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitByProvider} layout="vertical">
                      <XAxis
                        type="number"
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v / 1000}k`} />
                      
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={70} />
                      
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                      
                      <Bar dataKey="profit" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Provider Performance Scorecard</CardTitle>
              <CardDescription>
                Track reliability, delays and revenue across transport partners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Delays</TableHead>
                    <TableHead>Lost</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Top Route</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerPerformance.map((p) => {
                    const rate = Math.round(p.success / p.total * 100);
                    return (
                      <TableRow key={p.name}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={rate >= 97 ? 'success' : 'warning'}>
                            
                            {rate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{p.delays}</TableCell>
                        <TableCell
                          className={p.lost > 6 ? 'text-red-600 font-medium' : ''}>
                          
                          {p.lost}
                        </TableCell>
                        <TableCell>{p.avgTime}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1">
                            {p.rating}
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          </span>
                        </TableCell>
                        <TableCell>KES {p.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {p.topRoute}
                        </TableCell>
                      </TableRow>);

                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Predefined Transport Routes</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Route
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Preferred Providers</TableHead>
                    <TableHead>Avg. Transit Time</TableHead>
                    <TableHead>Base Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRoutes.map((route) =>
                  <TableRow key={route.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {route.origin}{' '}
                          <ArrowRight className="h-3 w-3 text-slate-400" />{' '}
                          {route.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {route.providers.map((p) =>
                        <Badge
                          key={p}
                          variant="secondary"
                          className="text-xs">
                          
                              {p}
                            </Badge>
                        )}
                        </div>
                      </TableCell>
                      <TableCell>{route.avgTime}</TableCell>
                      <TableCell>
                        KES {route.baseCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multileg" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Shipment selector */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Active Multi-Leg Shipments</CardTitle>
                <CardDescription>
                  Runner → SACCO → Rider hybrid deliveries.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {multiLegShipments.map((s) => {
                  const active = s.id === selectedShipment;
                  const doneCount = s.legs.filter((l) => l.state === 'done').length;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedShipment(s.id)}
                      aria-pressed={active}
                      className={
                      'w-full rounded-lg border p-3 text-left transition-colors ' + (
                      active ?
                      'border-blue-600 bg-blue-50' :
                      'border-slate-200 hover:bg-slate-50')
                      }>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">
                          {s.id}
                        </span>
                        <Badge variant="secondary">
                          {doneCount}/{s.legs.length} legs
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {s.route}
                      </div>
                      <div className="text-xs text-slate-400">
                        {s.customer} · {s.provider}
                      </div>
                    </button>);

                })}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GitMerge className="h-4 w-4 text-blue-600" />
                  <CardTitle>{shipment.route}</CardTitle>
                </div>
                <CardDescription>
                  {shipment.id} · {shipment.customer} · via {shipment.provider}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-0">
                  {shipment.legs.map((leg, i) => {
                    const isLast = i === shipment.legs.length - 1;
                    return (
                      <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                        {!isLast &&
                        <span
                          className={
                          'absolute left-[15px] top-8 h-full w-0.5 ' + (
                          leg.state === 'done' ?
                          'bg-green-500' :
                          'bg-slate-200')
                          }
                          aria-hidden="true" />

                        }
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={
                          'relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ' + (
                          leg.state === 'done' ?
                          'bg-green-500 text-white' :
                          leg.state === 'active' ?
                          'bg-blue-600 text-white ring-4 ring-blue-100' :
                          'bg-slate-100 text-slate-400')
                          }>
                          
                          {leg.state === 'done' ?
                          <Check className="h-4 w-4" /> :

                          <span className="text-xs font-semibold">{i + 1}</span>
                          }
                        </motion.div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={
                              'text-sm font-medium ' + (
                              leg.state === 'pending' ?
                              'text-slate-400' :
                              'text-slate-900')
                              }>
                              
                              {leg.label}
                            </span>
                            <span className="text-xs text-slate-400">
                              {leg.time}
                            </span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                            <span>{leg.party}</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {leg.location}
                            </span>
                            {leg.state !== 'pending' &&
                            <span className="inline-flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {leg.phone}
                              </span>
                            }
                          </div>
                        </div>
                      </li>);

                  })}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Transport notifications */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <CardTitle>Transport Notifications</CardTitle>
              </div>
              <CardDescription>
                Automatically notify customers at each stage of the journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {rules.map((rule) =>
                <div
                  key={rule.key}
                  className="flex items-center justify-between py-3">
                  
                    <span className="text-sm font-medium text-slate-700">
                      {rule.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                      type="button"
                      onClick={() => toggleRule(rule.key, 'push')}
                      aria-pressed={rule.push}
                      className={
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ' + (
                      rule.push ?
                      'border-blue-600 bg-blue-50 text-blue-700' :
                      'border-slate-200 text-slate-400 hover:bg-slate-50')
                      }>
                      
                        <Smartphone className="h-3 w-3" /> Push
                      </button>
                      <button
                      type="button"
                      onClick={() => toggleRule(rule.key, 'sms')}
                      aria-pressed={rule.sms}
                      className={
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ' + (
                      rule.sms ?
                      'border-blue-600 bg-blue-50 text-blue-700' :
                      'border-slate-200 text-slate-400 hover:bg-slate-50')
                      }>
                      
                        <MessageSquare className="h-3 w-3" /> SMS
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

}