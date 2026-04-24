
## Getting Started

1. Run `npm install`
2. Run `npm run dev`
3. Copy `.env.example` to `.env` and set your Supabase values
4. Configure Supabase redirect URLs:
	- In your Supabase project, go to Auth → Providers → Email
	- Add redirect URL: `http://localhost:5173/auth/callback` (development)
	- Add redirect URL: `https://yourdomain.com/auth/callback` (production)
	- Users will be directed here after clicking the magic link in their email

## Backend

A PostgreSQL-backed backend scaffold is available in `backend/`.

1. Copy `backend/.env.example` to `backend/.env`
2. Set the PostgreSQL `DATABASE_URL`
3. From `backend/`, run `npm install`
4. Run `npm run prisma:generate`
5. Run `npm run prisma:migrate`
6. Run `npm run dev`
