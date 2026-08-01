import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Map,
  Users,
  UserCircle,
  Building2,
  Settings,
  CreditCard,
  BarChart3,
  MessageSquare,
  LifeBuoy,
  SlidersHorizontal,
  Bus } from
'lucide-react';
import { cn } from '../ui/utils';
const navigation = [
{
  name: 'Overview',
  href: '/',
  icon: LayoutDashboard
},
{
  name: 'Orders',
  href: '/orders',
  icon: Package
},
{
  name: 'Dispatch Map',
  href: '/dispatch',
  icon: Map
},
{
  name: 'Transport & 3rd Party',
  href: '/transport',
  icon: Bus
},
{
  name: 'Riders & Runners',
  href: '/fleet',
  icon: Users
},
{
  name: 'Customers',
  href: '/customers',
  icon: UserCircle
},
{
  name: 'Business Clients',
  href: '/business',
  icon: Building2
},
{
  name: 'Pricing',
  href: '/pricing',
  icon: SlidersHorizontal
},
{
  name: 'Finance',
  href: '/finance',
  icon: CreditCard
},
{
  name: 'Analytics',
  href: '/analytics',
  icon: BarChart3
},
{
  name: 'Messages',
  href: '/messages',
  icon: MessageSquare
},
{
  name: 'Support',
  href: '/support',
  icon: LifeBuoy
},
{
  name: 'Settings',
  href: '/settings',
  icon: Settings
}];

export function Sidebar() {
  const location = useLocation();
  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white">
            <Package size={20} />
          </div>
          SwiftLogistics
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  isActive ?
                  'bg-slate-100 text-blue-600' :
                  'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}>
                
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ?
                    'text-blue-600' :
                    'text-slate-400 group-hover:text-slate-500'
                  )}
                  aria-hidden="true" />
                
                {item.name}
              </Link>);

          })}
        </nav>
      </div>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">John Doe</span>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
        </div>
      </div>
    </div>);

}