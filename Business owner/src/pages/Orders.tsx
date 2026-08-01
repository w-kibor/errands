import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
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
import { Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fetchAdminOrders, updateOrderStatus, fetchAdminFleet, assignRiderToOrder, AdminOrder, FleetMember } from '../lib/api';

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return <Badge variant="warning">Pending</Badge>;
    case 'RIDER_ASSIGNED':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Assigned</Badge>;
    case 'PICKING_UP':
      return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Picking Up</Badge>;
    case 'EN_ROUTE':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En Route</Badge>;
    case 'DELIVERED':
      return <Badge variant="success">Delivered</Badge>;
    case 'CANCELLED':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [fleet, setFleet] = useState<FleetMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, fleetRes] = await Promise.all([
        fetchAdminOrders(searchTerm),
        fetchAdminFleet()
      ]);
      setOrders(ordersRes.orders);
      setFleet(fleetRes.fleet);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderNumber, newStatus);
      loadData();
    } catch (err) {
      alert('Failed to update status: ' + (err as Error).message);
    }
  };

  const handleAssignRider = async (orderNumber: string, riderId: string) => {
    try {
      await assignRiderToOrder(orderNumber, riderId);
      loadData();
    } catch (err) {
      alert('Failed to assign rider: ' + (err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Order Management
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search order # or customer..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Total Orders: {orders.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Assigned Rider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                    {loading ? 'Loading orders...' : 'No orders found'}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.user?.name || 'Customer'}</div>
                      <div className="text-xs text-slate-500">{order.user?.phone || 'No phone'}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-slate-600">
                      <div><span className="font-semibold text-slate-700">From:</span> {order.pickup?.address}</div>
                      <div><span className="font-semibold text-slate-700">To:</span> {order.dropoff?.address}</div>
                    </TableCell>
                    <TableCell>
                      {order.rider ? (
                        <div className="text-sm">
                          <span className="font-medium text-slate-900">{order.rider.name}</span>
                          <div className="text-xs text-slate-500">{order.rider.phone}</div>
                        </div>
                      ) : (
                        <select
                          className="text-xs border rounded p-1 bg-amber-50 text-amber-900"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) handleAssignRider(order.orderNumber, e.target.value);
                          }}
                        >
                          <option value="" disabled>Assign Rider...</option>
                          {fleet.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.vehicleType})
                            </option>
                          ))}
                        </select>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-semibold">KES {order.price.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {order.date ? format(new Date(order.date), 'MMM d, h:mm a') : '-'}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <select
                        className="text-xs border rounded px-1.5 py-1 bg-white"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="RIDER_ASSIGNED">ASSIGNED</option>
                        <option value="PICKING_UP">PICKING UP</option>
                        <option value="EN_ROUTE">EN ROUTE</option>
                        <option value="DELIVERED">DELIVERED</option>
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
    </div>
  );
}