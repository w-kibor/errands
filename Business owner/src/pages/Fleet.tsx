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
import { Search, Star, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { fetchAdminFleet, toggleRunnerVerification, FleetMember } from '../lib/api';

export function Fleet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fleet, setFleet] = useState<FleetMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFleet = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminFleet();
      setFleet(res.fleet);
    } catch (err) {
      console.error('Error fetching fleet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleet();
  }, []);

  const handleToggleVerification = async (runnerId: string, currentVerified: boolean) => {
    try {
      await toggleRunnerVerification(runnerId, !currentVerified);
      loadFleet();
    } catch (err) {
      alert('Failed to update verification status: ' + (err as Error).message);
    }
  };

  const filteredFleet = fleet.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineCount = fleet.filter((f) => f.isOnline || f.status === 'In Transit').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Riders & Runners Fleet
        </h1>
        <Button variant="outline" onClick={loadFleet} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Fleet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleet.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active / Online Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              4.8 <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search runner name or phone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-slate-500">
              Showing {filteredFleet.length} members
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personnel</TableHead>
                <TableHead>Vehicle & Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Jobs Completed</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFleet.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    {loading ? 'Loading fleet personnel...' : 'No personnel registered'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFleet.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-xs text-slate-500">{person.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-xs">{person.vehicleType}</div>
                      <div className="text-xs text-slate-500">{person.coverageArea}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          person.status === 'In Transit' ? 'secondary' :
                          person.isOnline ? 'success' : 'outline'
                        }
                      >
                        {person.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {person.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <XCircle className="h-3 w-3" /> Unverified
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{person.completedJobs}</TableCell>
                    <TableCell className="font-medium">KES {person.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={person.verified ? 'outline' : 'default'}
                        onClick={() => handleToggleVerification(person.id, person.verified)}
                      >
                        {person.verified ? 'Revoke Verification' : 'Verify Personnel'}
                      </Button>
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