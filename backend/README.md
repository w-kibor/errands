## SwiftDrop Backend

PostgreSQL-backed API for the SwiftDrop app.

### Setup

1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL` to your PostgreSQL database
3. Run `npm install`
4. Run `npm run prisma:generate`
5. Run `npm run prisma:migrate`
6. Run `npm run dev`
