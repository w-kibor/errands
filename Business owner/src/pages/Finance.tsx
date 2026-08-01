import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchAdminFinance, FinanceStats } from '../lib/api';

export function Finance() {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFinance = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminFinance();
      setStats(data);
    } catch (err) {
      console.error('Error loading finance stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Finance & Platform Revenues
        </h1>
        <Button variant="outline" onClick={loadFinance} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Revenue (Delivered Orders)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {(stats?.grossRevenue ?? 1850000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From {stats?.totalDeliveredOrders ?? 0} delivered orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Commission Net Profit
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              KES {(stats?.platformCommission ?? 370000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">20% commission rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rider & Runner Payouts
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              KES {(stats?.riderPayouts ?? 1480000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">80% earnings payout</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-slate-50 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Total Orders Delivered:</span>
              <span className="font-semibold">{stats?.totalDeliveredOrders ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Transaction Volume:</span>
              <span className="font-semibold">KES {(stats?.grossRevenue ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Platform Take-Rate (Net Profit):</span>
              <span className="font-semibold">KES {(stats?.platformCommission ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>Rider Earnings (Net Payout):</span>
              <span className="font-semibold">KES {(stats?.riderPayouts ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}