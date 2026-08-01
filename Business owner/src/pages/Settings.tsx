import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Settings as SettingsIcon,
  Map,
  DollarSign,
  Bell,
  Shield } from
'lucide-react';
export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Platform Settings
        </h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <nav className="flex flex-col gap-1">
          <Button variant="secondary" className="justify-start">
            <SettingsIcon className="mr-2 h-4 w-4" /> General
          </Button>
          <Button variant="ghost" className="justify-start">
            <Map className="mr-2 h-4 w-4" /> Service Areas
          </Button>
          <Button variant="ghost" className="justify-start">
            <DollarSign className="mr-2 h-4 w-4" /> Pricing
          </Button>
          <Button variant="ghost" className="justify-start">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="justify-start">
            <Shield className="mr-2 h-4 w-4" /> Security
          </Button>
        </nav>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Name</label>
                <Input defaultValue="SwiftLogistics" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input defaultValue="support@swiftlogistics.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone</label>
                <Input defaultValue="+1 (800) 123-4567" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Opening Time</label>
                  <Input type="time" defaultValue="06:00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Closing Time</label>
                  <Input type="time" defaultValue="23:00" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}