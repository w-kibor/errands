export const serviceCatalog = [
  {
    id: 'cbd-batch-delivery',
    name: 'CBD Batch Delivery',
    description: 'Multi-stop CBD deliveries for shops and high-volume dispatches.',
    requiresPickup: true,
    requiresDropoff: true
  },
  {
    id: 'personal-shopping',
    name: 'Personal Shopping',
    description: 'A runner shops requested items and delivers to your address.',
    requiresPickup: false,
    requiresDropoff: true
  },
  {
    id: 'parcel-pickup-dropoff',
    name: 'Parcel Pickup and Drop Off',
    description: 'Door-to-door package pickup and delivery across the city.',
    requiresPickup: true,
    requiresDropoff: true
  },
  {
    id: 'shop-legitimacy-verification',
    name: 'Shop Legitimacy Verification',
    description: 'Verify physical shops before payment or bulk purchase.',
    requiresPickup: false,
    requiresDropoff: false
  },
  {
    id: 'custom-task-requests',
    name: 'Custom Task Requests',
    description: 'Flexible errands tailored to your special instructions.',
    requiresPickup: false,
    requiresDropoff: false
  },
  {
    id: 'dedicated-business-errands',
    name: 'Dedicated Business Errands Support',
    description: 'Recurring business support for pickups, runs, and admin errands.',
    requiresPickup: true,
    requiresDropoff: true
  }
] as const;
