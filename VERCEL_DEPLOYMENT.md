# Vercel Deployment Guide

This guide will help you deploy your Airbnb cleaning application to Vercel with working Stripe webhooks.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Account**: Your code should be in a Git repository
3. **Stripe Account**: Set up as described in `STRIPE_SETUP.md`
4. **Database**: Set up your database (PostgreSQL recommended for Vercel)

## Step 1: Prepare Your Application

### 1.1 Database Setup

If you're using Prisma with PostgreSQL:

1. **Set up a PostgreSQL database** (recommended options):
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Neon](https://neon.tech)
   - [Supabase](https://supabase.com)

2. **Update your `DATABASE_URL`** in your environment variables

### 1.2 Environment Variables

Create a `.env.local` file for local development:

```env
# Database
DATABASE_URL="your_database_connection_string"

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Email/SMS (if using)
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Select the repository containing your application**

### 2.2 Configure Project Settings

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build` (should auto-detect)
4. **Output Directory**: `.next` (should auto-detect)
5. **Install Command**: `npm install` (should auto-detect)

### 2.3 Set Environment Variables

In the Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add each environment variable** from your `.env.local`:
   ```
   DATABASE_URL=your_database_connection_string
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

3. **Select all environments** (Production, Preview, Development)

### 2.4 Deploy

1. **Click "Deploy"**
2. **Wait for the build to complete**
3. **Note your deployment URL** (e.g., `https://your-app.vercel.app`)

## Step 3: Set Up Stripe Webhook

### 3.1 Create Webhook in Stripe Dashboard

1. **Go to [dashboard.stripe.com](https://dashboard.stripe.com)**
2. **Navigate to Developers → Webhooks**
3. **Click "Add endpoint"**
4. **Enter your webhook URL**: `https://your-app.vercel.app/api/webhooks/stripe`
5. **Select these events**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
6. **Click "Add endpoint"**

### 3.2 Get Webhook Secret

1. **Click on your newly created webhook**
2. **Copy the "Signing secret"** (starts with `whsec_`)
3. **Update your Vercel environment variable**:
   - Go to Vercel dashboard → Settings → Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the new secret
   - Redeploy your application

## Step 4: Database Migration

### 4.1 Run Database Migrations

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Run database migrations**:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   ```

4. **Seed the database** (if needed):
   ```bash
   npm run db:seed
   ```

## Step 5: Test Your Deployment

### 5.1 Test Webhook Endpoint

1. **Test the webhook endpoint**:
   ```bash
   curl https://your-app.vercel.app/api/webhooks/test
   ```

2. **You should see**:
   ```json
   {
     "status": "Test webhook endpoint is working",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

### 5.2 Test Payment Flow

1. **Go to your deployed application**
2. **Try to book a cleaning service**
3. **Complete a test payment** using Stripe test cards
4. **Verify the booking is created** and payment status updates

### 5.3 Monitor Webhook Processing

1. **Go to Vercel Dashboard**
2. **Click on your project**
3. **Go to Functions tab**
4. **Look for `/api/webhooks/stripe` function**
5. **Check the logs for webhook processing**

## Step 6: Troubleshooting

### Common Issues and Solutions

#### 1. Webhook Not Receiving Events

**Symptoms**: Payments complete but bookings don't update

**Solutions**:
- Verify webhook URL is correct in Stripe dashboard
- Check that webhook is enabled
- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel
- Check Vercel function logs for errors

#### 2. Function Timeout

**Symptoms**: Webhook processing fails with timeout errors

**Solutions**:
- Check `vercel.json` has proper timeout configuration
- Optimize database operations
- Consider using connection pooling

#### 3. Environment Variables Not Working

**Symptoms**: "Stripe not configured" errors

**Solutions**:
- Verify all environment variables are set in Vercel dashboard
- Redeploy after adding environment variables
- Check that variable names match exactly

#### 4. Database Connection Issues

**Symptoms**: Database errors in function logs

**Solutions**:
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from Vercel
- Check database connection limits

### Debugging Steps

1. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Functions
   - Look for errors in `/api/webhooks/stripe`

2. **Test Webhook Locally**:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

3. **Verify Stripe Dashboard**:
   - Check webhook delivery status
   - Look for failed webhook attempts

4. **Check Environment Variables**:
   ```bash
   vercel env ls
   ```

## Step 7: Production Considerations

### 7.1 Security

- Use live Stripe keys for production
- Set up proper CORS if needed
- Monitor webhook security

### 7.2 Performance

- Consider using connection pooling for database
- Monitor function execution times
- Set up proper logging and monitoring

### 7.3 Monitoring

- Set up alerts for failed payments
- Monitor webhook delivery rates
- Track application performance

## Step 8: Going Live

1. **Switch to live Stripe keys**:
   - Update environment variables in Vercel
   - Create new webhook for production
   - Test with small amounts first

2. **Update webhook endpoint**:
   - Create new webhook in Stripe dashboard
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel
   - Redeploy application

3. **Monitor everything**:
   - Check Vercel function logs regularly
   - Monitor Stripe dashboard
   - Set up proper alerts

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Stripe Documentation](https://stripe.com/docs)
3. Check function logs in Vercel dashboard
4. Verify environment variables are set correctly
5. Test webhook endpoint manually

## Useful Commands

```bash
# Deploy to Vercel
vercel --prod

# Pull environment variables
vercel env pull .env.local

# View function logs
vercel logs

# Test webhook locally
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```
