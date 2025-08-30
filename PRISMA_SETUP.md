# Prisma Database Setup

This project now uses Prisma as the ORM for database operations. Follow this guide to set up your database.

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local or cloud)

## Step 1: Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database for the project
3. Note the connection details

### Option B: Cloud Database (Recommended)
- **Neon**: [neon.tech](https://neon.tech) (Free tier available)
- **Supabase**: [supabase.com](https://supabase.com) (Free tier available)
- **Railway**: [railway.app](https://railway.app) (Free tier available)

## Step 2: Environment Variables

Add your database connection string to `.env.local`:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/airbnb_clean"
```

For cloud databases, use the connection string provided by your provider.

## Step 3: Database Migration

1. **Create and run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Seed the database with initial data**:
   ```bash
   npm run db:seed
   ```

## Step 4: Verify Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the API endpoints**:
   - `GET /api/pricing` - Should return pricing data from database
   - `GET /api/bookings` - Should return empty array initially

## Database Schema

### Bookings Table
- `id`: Unique booking identifier
- `serviceType`: 'HOME' or 'AIRBNB'
- `bedrooms`, `bathrooms`, `livingAreas`: Room counts
- `price`: Total booking price
- `customerName`, `customerEmail`, `customerPhone`: Customer details
- `address`: Service address
- `date`, `time`: Service date and time
- `addons`: JSON field for additional services
- `bedSizes`: JSON field for bed size preferences
- `paymentStatus`: 'PENDING' or 'COMPLETED'
- `stripeSessionId`: Stripe payment session ID
- `paymentCompletedAt`: Payment completion timestamp
- `createdAt`, `updatedAt`: Timestamps

### Pricing Table
- `id`: Auto-incrementing primary key
- `serviceType`: 'HOME' or 'AIRBNB'
- `key`: Pricing key (e.g., 'baseRate', 'bedroom')
- `price`: Price value
- `createdAt`, `updatedAt`: Timestamps

## Development Commands

```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npm run db:seed
```

## Production Deployment

1. **Set up production database**
2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Seed production data** (if needed):
   ```bash
   npm run db:seed
   ```

## Troubleshooting

### Common Issues

1. **Connection refused**: Check your DATABASE_URL and ensure the database is running
2. **Migration errors**: Run `npx prisma migrate reset` to start fresh
3. **Type errors**: Run `npx prisma generate` after schema changes

### Reset Database
```bash
npx prisma migrate reset
npm run db:seed
```

## Benefits of Prisma

- ✅ **Type Safety**: Full TypeScript support
- ✅ **Auto-completion**: IDE support for database queries
- ✅ **Migrations**: Version-controlled database schema
- ✅ **Relationships**: Easy to add relationships between tables
- ✅ **Performance**: Optimized queries and connection pooling
- ✅ **Developer Experience**: Prisma Studio for database management
