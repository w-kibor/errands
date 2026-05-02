## SwiftDrop Backend

PostgreSQL-backed API for the SwiftDrop app.

### Setup

1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL` to your PostgreSQL database
3. Run `npm install`
4. Run `npm run prisma:generate`
5. Run `npm run prisma:migrate`
6. Run `npm run dev`

Admin bypass (development only)
-------------------------------

You can enable an admin impersonation backdoor for development and debugging. It only works when `NODE_ENV=development`.

1. Set a secret in your environment (example in `.env`):

```
ADMIN_BYPASS_SECRET=super-secret-value
```

2. Restart the backend so the env var is picked up:

```bash
cd backend
npm run dev
```

3. Make requests with the header and query param to act as a user:

Header: `x-admin-bypass: <your-secret>`

Query: `?asUser=<target-user-id>`

Examples:

Curl:
```bash
curl -H "Content-Type: application/json" \
	-H "x-admin-bypass: super-secret-value" \
	"http://localhost:4000/api/users/ignored/orders?asUser=USER_ID"
```

Notes:
- This middleware overrides `req.params.userId` with the `asUser` value for routes that depend on `:userId`.
- The middleware sets `req.isAdminBypass = true` for possible auditing.
- Do NOT enable this in production without strict access controls and logging.

