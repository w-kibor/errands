import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Package,
  Truck,
  DollarSign,
  Activity,
  Star,
  MapPin,
  List,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from 'recharts';
import { fetchOverviewStats, OverviewStats } from '../lib/api';

const defaultRevenueData = [
  { name: 'Mon', total: 15600 },
  { name: 'Tue', total: 27300 },
  { name: 'Wed', total: 23400 },
  { name: 'Thu', total: 31200 },
  { name: 'Fri', total: 41600 },
  { name: 'Sat', total: 53300 },
  { name: 'Sun', total: 49400 }
];

const defaultDeliveryData = [
  { name: '8am', deliveries: 45 },
  { name: '10am', deliveries: 80 },
  { name: '12pm', deliveries: 120 },
  { name: '2pm', deliveries: 90 },
  { name: '4pm', deliveries: 110 },
  { name: '6pm', deliveries: 150 },
  { name: '8pm', deliveries: 70 }
];

const peakAreas = [
  { name: 'Nairobi CBD', level: 'Very High', orders: 312, trend: '+15%', color: 'text-red-600', bar: 'bg-red-500' },
  { name: 'Westlands', level: 'High', orders: 268, trend: '+8%', color: 'text-orange-600', bar: 'bg-orange-500' },
  { name: 'Kilimani', level: 'High', orders: 214, trend: '+5%', color: 'text-orange-600', bar: 'bg-orange-500' },
  { name: 'Kasarani', level: 'Moderate', orders: 158, trend: '+3%', color: 'text-amber-600', bar: 'bg-amber-500' },
  { name: 'Upper Hill', level: 'Moderate', orders: 132, trend: '-2%', color: 'text-amber-600', bar: 'bg-amber-500' }
];

const peakMax = Math.max(...peakAreas.map((a) => a.orders));

export function Overview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchOverviewStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load overview stats from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Overview Dashboard
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>Last updated: Just now</span>
          <button
            onClick={loadStats}
            className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {(stats?.totalRevenue ?? 1620000).toLocaleString()}
            </div>
            <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex justify-between items-center">
                <span>This Week:</span>
                <span className="font-medium text-slate-700">
                  KES {(stats?.thisWeekRevenue ?? 1054000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>This Month:</span>
                <span className="font-medium text-slate-700">
                  KES {(stats?.thisMonthRevenue ?? 4520000).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.ordersToday ?? 18).toLocaleString()}
            </div>
            <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex justify-between items-center">
                <span>Completed:</span>
                <span className="font-medium text-green-600">
                  {stats?.completedToday ?? 14}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancelled:</span>
                <span className="font-medium text-red-600">
                  {stats?.cancelledToday ?? 1}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Operations Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Deliveries
            </CardTitle>
            <Activity className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeDeliveries ?? 3}
            </div>
            <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex justify-between items-center">
                <span>Pending Dispatches:</span>
                <span className="font-medium text-amber-600">
                  {stats?.pendingDispatches ?? 2}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Avg Delivery Time:</span>
                <span className="font-medium text-slate-700">28 mins</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-baseline gap-2">
              {stats?.activeFleetCount ?? 12}
              <span className="text-xs font-normal text-slate-500">
                ({stats?.ridersCount ?? 8} Riders, {stats?.runnersCount ?? 4} Runners)
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex justify-between items-center">
                <span>On Delivery:</span>
                <span className="font-medium text-slate-700">
                  {stats?.activeDeliveries ?? 3}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Available Nearby:</span>
                <span className="font-medium text-green-600">
                  {Math.max(0, (stats?.activeFleetCount ?? 12) - (stats?.activeDeliveries ?? 3))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Charts Column */}
        <div className="space-y-4 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={defaultRevenueData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `KES ${value >= 1000 ? `${value / 1000}k` : value}`}
                    />
                    <Tooltip formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Volume (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defaultDeliveryData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="deliveries" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Customer Satisfaction */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9/5.0</div>
              <p className="text-xs text-slate-500 mt-1">Based on recent customer reviews</p>
            </CardContent>
          </Card>

          {/* Peak Demand Areas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" /> Peak Demand Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {peakAreas.map((area) => (
                  <div key={area.name}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{area.name}</span>
                      <span className="text-xs text-slate-500">
                        {area.orders} orders
                        <span className={`ml-2 font-medium ${area.color}`}>{area.trend}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-1.5 rounded-full ${area.bar}`}
                        style={{ width: `${Math.round((area.orders / peakMax) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <List className="h-4 w-4 text-blue-500" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats?.recentActivity || []).length > 0 ? (
                  stats?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {activity.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {activity.type === 'info' && <Activity className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        {activity.type === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      </div>
                      <div>
                        <div className="text-sm text-slate-900 leading-snug">{activity.text}</div>
                        <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">No recent activity yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}