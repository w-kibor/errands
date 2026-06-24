import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

interface RunnerLocation {
  runnerId: string;
  name: string;
  vehicle: string;
  avatar: string;
  lat: number;
  lng: number;
  updatedAt: number;
}

// In-memory store for active runner locations
export const onlineRunners = new Map<string, RunnerLocation>();

// Maps orderId -> Set of WebSockets tracking it
const orderSubscriptions = new Map<string, Set<WebSocket>>();

// Set of WebSockets tracking nearby runners
const nearbySubscriptions = new Set<WebSocket>();

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  console.log('WebSocket server attached to HTTP server');

  wss.on('connection', (ws: WebSocket) => {
    let currentSubscriptions: { orderId?: string; riderId?: string } = {};
    let isSubscribedToNearby = false;

    ws.on('message', (messageData: string) => {
      try {
        const message = JSON.parse(messageData);

        switch (message.type) {
          case 'runner_online': {
            const { runnerId, name, vehicle, avatar, lat, lng } = message;
            if (!runnerId) return;

            const runner: RunnerLocation = {
              runnerId,
              name: name || 'Runner',
              vehicle: vehicle || 'Courier',
              avatar: avatar || '',
              lat: lat || -1.286389,
              lng: lng || 36.817223,
              updatedAt: Date.now()
            };

            onlineRunners.set(runnerId, runner);
            console.log(`Runner ${runnerId} (${name}) is online`);
            broadcastNearbyRunners();
            break;
          }

          case 'runner_location': {
            const { runnerId, lat, lng } = message;
            if (!runnerId || lat === undefined || lng === undefined) return;

            const runner = onlineRunners.get(runnerId);
            if (runner) {
              runner.lat = lat;
              runner.lng = lng;
              runner.updatedAt = Date.now();
              onlineRunners.set(runnerId, runner);
            } else {
              // Create if didn't exist
              onlineRunners.set(runnerId, {
                runnerId,
                name: 'Runner',
                vehicle: 'Courier',
                avatar: '',
                lat,
                lng,
                updatedAt: Date.now()
              });
            }

            // Broadcast to any clients listening to this runner's orders
            broadcastRiderLocation(runnerId, lat, lng);
            broadcastNearbyRunners();
            break;
          }

          case 'runner_offline': {
            const { runnerId } = message;
            if (runnerId) {
              onlineRunners.delete(runnerId);
              console.log(`Runner ${runnerId} is offline`);
              broadcastNearbyRunners();
            }
            break;
          }

          case 'subscribe_order': {
            const { orderId, riderId } = message;
            if (!orderId) return;

            currentSubscriptions.orderId = orderId;
            currentSubscriptions.riderId = riderId;

            if (!orderSubscriptions.has(orderId)) {
              orderSubscriptions.set(orderId, new Set());
            }
            orderSubscriptions.get(orderId)!.add(ws);

            console.log(`Client subscribed to order ${orderId}`);

            // Send initial location if rider is online
            if (riderId) {
              const runner = onlineRunners.get(riderId);
              if (runner) {
                ws.send(JSON.stringify({
                  type: 'location_update',
                  orderId,
                  riderId,
                  lat: runner.lat,
                  lng: runner.lng
                }));
              }
            }
            break;
          }

          case 'subscribe_nearby': {
            isSubscribedToNearby = true;
            nearbySubscriptions.add(ws);
            console.log('Client subscribed to nearby runners');
            
            // Send current list of online runners immediately
            ws.send(JSON.stringify({
              type: 'nearby_runners',
              runners: Array.from(onlineRunners.values())
            }));
            break;
          }

          default:
            console.warn('Unknown message type:', message.type);
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      // Clean up subscriptions
      if (currentSubscriptions.orderId) {
        const subs = orderSubscriptions.get(currentSubscriptions.orderId);
        if (subs) {
          subs.delete(ws);
          if (subs.size === 0) {
            orderSubscriptions.delete(currentSubscriptions.orderId);
          }
        }
      }

      if (isSubscribedToNearby) {
        nearbySubscriptions.delete(ws);
      }
    });
  });
}

// Broadcast nearby runners to all interested connections
export function broadcastNearbyRunners() {
  const runnersList = Array.from(onlineRunners.values());
  const payload = JSON.stringify({
    type: 'nearby_runners',
    runners: runnersList
  });

  for (const ws of nearbySubscriptions) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

// Broadcast specific runner location to clients subscribed to orders with that rider
export function broadcastRiderLocation(riderId: string, lat: number, lng: number) {
  const payload = JSON.stringify({
    type: 'location_update',
    riderId,
    lat,
    lng
  });

  // Find all subscriptions that map to this riderId
  for (const [orderId, wsSet] of orderSubscriptions.entries()) {
    for (const ws of wsSet) {
      // If client is tracking this order, we send them the location update
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'location_update',
          orderId,
          riderId,
          lat,
          lng
        }));
      }
    }
  }
}

// Broadcast order status changes to tracking clients
export function broadcastOrderStatusChange(orderId: string, status: string) {
  console.log(`Broadcasting status change for order ${orderId} -> ${status}`);
  const payload = JSON.stringify({
    type: 'status_update',
    orderId,
    status
  });

  const wsSet = orderSubscriptions.get(orderId);
  if (wsSet) {
    for (const ws of wsSet) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }
}
