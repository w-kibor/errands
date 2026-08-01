import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  SlidersHorizontal,
  Calculator,
  Ticket,
  Gift,
  CheckCircle2,
  Info } from
'lucide-react';
type PriceField = {
  key: string;
  label: string;
  value: number;
  unit: string;
  hint?: string;
};
const initialGroups: {
  title: string;
  description: string;
  fields: PriceField[];
}[] = [
{
  title: 'Base & Distance',
  description: 'Core fees applied to every delivery.',
  fields: [
  {
    key: 'base',
    label: 'Base delivery fee',
    value: 150,
    unit: 'KES'
  },
  {
    key: 'perKm',
    label: 'Per-kilometre',
    value: 35,
    unit: 'KES/km'
  },
  {
    key: 'rider',
    label: 'Rider pricing',
    value: 120,
    unit: 'KES'
  },
  {
    key: 'runner',
    label: 'Runner pricing',
    value: 90,
    unit: 'KES'
  },
  {
    key: 'vehicle',
    label: 'Vehicle (van) pricing',
    value: 400,
    unit: 'KES'
  }]

},
{
  title: 'Service Charges',
  description: 'Optional add-ons applied per order.',
  fields: [
  {
    key: 'express',
    label: 'Express delivery fee',
    value: 200,
    unit: 'KES'
  },
  {
    key: 'waiting',
    label: 'Waiting charge',
    value: 20,
    unit: 'KES/min'
  },
  {
    key: 'heavy',
    label: 'Heavy package surcharge',
    value: 150,
    unit: 'KES'
  },
  {
    key: 'fragile',
    label: 'Fragile package surcharge',
    value: 100,
    unit: 'KES'
  }]

},
{
  title: 'Time & Demand Multipliers',
  description: 'Dynamic pricing based on timing and demand.',
  fields: [
  {
    key: 'night',
    label: 'Night delivery',
    value: 1.2,
    unit: '×',
    hint: '9pm–5am'
  },
  {
    key: 'weekend',
    label: 'Weekend pricing',
    value: 1.15,
    unit: '×'
  },
  {
    key: 'holiday',
    label: 'Holiday pricing',
    value: 1.3,
    unit: '×'
  },
  {
    key: 'rain',
    label: 'Rain surge',
    value: 1.25,
    unit: '×'
  },
  {
    key: 'demand',
    label: 'High-demand surge',
    value: 1.5,
    unit: '×'
  },
  {
    key: 'business',
    label: 'Business discount',
    value: 0.9,
    unit: '×',
    hint: 'Applied to SME accounts'
  }]

}];

const coupons = [
{
  code: 'SWIFT20',
  type: 'Percentage',
  value: '20% off',
  uses: 342,
  status: 'Active'
},
{
  code: 'FIRSTRIDE',
  type: 'Fixed',
  value: 'KES 150 off',
  uses: 1204,
  status: 'Active'
},
{
  code: 'RAINYDAY',
  type: 'Percentage',
  value: '10% off',
  uses: 88,
  status: 'Paused'
},
{
  code: 'JULYFEST',
  type: 'Fixed',
  value: 'KES 100 off',
  uses: 0,
  status: 'Scheduled'
}];

export function Pricing() {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const v: Record<string, number> = {};
    initialGroups.forEach((g) => g.fields.forEach((f) => v[f.key] = f.value));
    return v;
  });
  const [dirty, setDirty] = useState(false);
  const [published, setPublished] = useState(false);
  // Preview calculator inputs
  const [distance, setDistance] = useState(5);
  const [weight, setWeight] = useState(3);
  const [express, setExpress] = useState(false);
  const [fragile, setFragile] = useState(false);
  const [surge, setSurge] = useState<'none' | 'rain' | 'demand' | 'night'>(
    'none'
  );
  const update = (key: string, next: number) => {
    setValues((prev) => ({
      ...prev,
      [key]: next
    }));
    setDirty(true);
    setPublished(false);
  };
  const price = useMemo(() => {
    let total = values.base + values.perKm * distance;
    if (weight > 5) total += values.heavy;
    if (express) total += values.express;
    if (fragile) total += values.fragile;
    const mult =
    surge === 'rain' ?
    values.rain :
    surge === 'demand' ?
    values.demand :
    surge === 'night' ?
    values.night :
    1;
    total *= mult;
    return Math.round(total);
  }, [values, distance, weight, express, fragile, surge]);
  const publish = () => {
    setDirty(false);
    setPublished(true);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pricing &amp; Delivery Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure fees and surcharges without changing code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {published &&
          <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Published
            </span>
          }
          {dirty &&
          <span className="text-sm text-amber-600">Unsaved changes</span>
          }
          <Button onClick={publish} disabled={!dirty}>
            Publish changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editable pricing groups */}
        <div className="space-y-6 lg:col-span-2">
          {initialGroups.map((group) =>
          <Card key={group.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                  <CardTitle>{group.title}</CardTitle>
                </div>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.fields.map((f) =>
                <div key={f.key}>
                      <label
                    htmlFor={f.key}
                    className="flex items-center justify-between text-sm font-medium text-slate-700">
                    
                        <span>{f.label}</span>
                        {f.hint &&
                    <span className="text-xs font-normal text-slate-400">
                            {f.hint}
                          </span>
                    }
                      </label>
                      <div className="relative mt-1">
                        <Input
                      id={f.key}
                      type="number"
                      step={f.unit === '×' ? 0.05 : 5}
                      value={values[f.key]}
                      onChange={(e) =>
                      update(f.key, Number(e.target.value) || 0)
                      }
                      className="pr-16" />
                    
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                          {f.unit}
                        </span>
                      </div>
                    </div>
                )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Promotions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-blue-600" />
                  <CardTitle>Promotional Coupons</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  New coupon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((c) =>
                  <TableRow key={c.code}>
                      <TableCell className="font-medium">{c.code}</TableCell>
                      <TableCell className="text-slate-500">{c.type}</TableCell>
                      <TableCell>{c.value}</TableCell>
                      <TableCell>{c.uses.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                        variant={
                        c.status === 'Active' ?
                        'success' :
                        c.status === 'Paused' ?
                        'secondary' :
                        'warning'
                        }>
                        
                          {c.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <Gift className="h-5 w-5 text-blue-600" />
                <div className="flex-1 text-sm">
                  <div className="font-medium text-slate-900">
                    Referral rewards
                  </div>
                  <div className="text-slate-500">
                    Refer a friend — both get KES 200 off their next delivery.
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live price preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <CardTitle>Price Preview</CardTitle>
              </div>
              <CardDescription>
                Preview calculations before publishing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="distance"
                  className="text-sm font-medium text-slate-700">
                  
                  Distance: {distance} km
                </label>
                <input
                  id="distance"
                  type="range"
                  min={1}
                  max={30}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="mt-2 w-full accent-blue-600" />
                
              </div>
              <div>
                <label
                  htmlFor="weight"
                  className="text-sm font-medium text-slate-700">
                  
                  Weight: {weight} kg{' '}
                  {weight > 5 &&
                  <span className="text-xs text-amber-600">
                      (heavy surcharge)
                    </span>
                  }
                </label>
                <input
                  id="weight"
                  type="range"
                  min={1}
                  max={20}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-2 w-full accent-blue-600" />
                
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setExpress((v) => !v)}
                  className={
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' + (
                  express ?
                  'border-blue-600 bg-blue-50 text-blue-700' :
                  'border-slate-200 text-slate-600 hover:bg-slate-50')
                  }
                  aria-pressed={express}>
                  
                  Express
                </button>
                <button
                  type="button"
                  onClick={() => setFragile((v) => !v)}
                  className={
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' + (
                  fragile ?
                  'border-blue-600 bg-blue-50 text-blue-700' :
                  'border-slate-200 text-slate-600 hover:bg-slate-50')
                  }
                  aria-pressed={fragile}>
                  
                  Fragile
                </button>
              </div>

              <div>
                <span className="text-sm font-medium text-slate-700">
                  Surge condition
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(
                  [
                  {
                    k: 'none',
                    label: 'None'
                  },
                  {
                    k: 'rain',
                    label: 'Rain'
                  },
                  {
                    k: 'demand',
                    label: 'High demand'
                  },
                  {
                    k: 'night',
                    label: 'Night'
                  }] as
                  const).
                  map((o) =>
                  <button
                    key={o.k}
                    type="button"
                    onClick={() => setSurge(o.k)}
                    className={
                    'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ' + (
                    surge === o.k ?
                    'border-blue-600 bg-blue-50 text-blue-700' :
                    'border-slate-200 text-slate-600 hover:bg-slate-50')
                    }
                    aria-pressed={surge === o.k}>
                    
                      {o.label}
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-900 p-4 text-white">
                <div className="text-xs text-slate-300">Estimated price</div>
                <div className="text-3xl font-bold">
                  KES {price.toLocaleString()}
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  Preview uses your unsaved edits. Publish to apply
                  platform-wide.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}