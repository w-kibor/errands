import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LifeBuoy, AlertCircle, CheckCircle2 } from 'lucide-react';
export function Support() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Customer Support
        </h1>
        <Button>New Ticket</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> 24
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> 156
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-blue-600" /> 12m
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) =>
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
              
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      Missing Item in Order #{9280 + i}
                    </span>
                    <Badge variant="warning">Open</Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    Customer reported missing drink from their delivery.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>);

}