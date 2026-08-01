import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search orders, riders, customers..."
            className="w-full bg-slate-50 pl-9" />
          
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          System Operational
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
      </div>
    </header>);

}