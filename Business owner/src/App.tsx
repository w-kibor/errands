import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Overview } from './pages/Overview';
import { Orders } from './pages/Orders';
import { DispatchMap } from './pages/DispatchMap';
import { Transport } from './pages/Transport';
import { Fleet } from './pages/Fleet';
import { Customers } from './pages/Customers';
import { BusinessClients } from './pages/BusinessClients';
import { Pricing } from './pages/Pricing';
import { Finance } from './pages/Finance';
import { Analytics } from './pages/Analytics';
import { Messages } from './pages/Messages';
import { Support } from './pages/Support';
import { Settings } from './pages/Settings';
export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dispatch" element={<DispatchMap />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/business" element={<BusinessClients />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="*"
            element={
            <div className="flex h-full items-center justify-center text-slate-500">
                Page under construction
              </div>
            } />
          
        </Routes>
      </AppLayout>
    </BrowserRouter>);

}