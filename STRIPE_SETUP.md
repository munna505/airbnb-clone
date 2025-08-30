# Stripe Setup Guide

This application requires real Stripe payments to function. Follow this guide to set up Stripe properly.

## Prerequisites

- A Stripe account (sign up at [stripe.com](https://stripe.com))
- Node.js and npm installed
- This application cloned and running
- A Vercel account (for production deployment)

## Step 1: Get Your Stripe API Keys

1. **Log into your Stripe Dashboard**
   - Go to [dashboard.stripe.com](https://dashboard.stripe.com)
   - Sign in to your account

2. **Navigate to API Keys**
   - Go to Developers → API Keys
   - You'll see two keys: **Publishable key** and **Secret key**

3. **Copy your keys**
   - **Publishable key**: Starts with `pk_test_` (test mode) or `pk_live_` (live mode)
   - **Secret key**: Starts with `sk_test_` (test mode) or `sk_live_` (live mode)

## Step 2: Configure Environment Variables

### For Local Development:

1. **Create or edit `.env.local`** in your project root:
   ```env
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3001
   
   # Stripe Configuration (Required)
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### For Vercel Production:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add these environment variables**:
   ```
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Step 3: Set Up Webhook Endpoint

### For Production (Vercel):

1. **Deploy your application to Vercel first**
   ```bash
   vercel --prod
   ```

2. **Get your production URL** (e.g., `https://your-app.vercel.app`)

3. **Create webhook in Stripe Dashboard**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Enter your webhook URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Select these events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `checkout.session.completed`
   - Click "Add endpoint"

4. **Get the webhook secret**
   - After creating the webhook, click on it
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### For Local Development:

1. **Install Stripe CLI**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases
   
   # Linux
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe CLI**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server**
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

4. **Copy the webhook secret**
   - The CLI will show you a webhook secret (starts with `whsec_`)
   - Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 4: Test Your Setup

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test the payment flow**
   - Go to your application
   - Try to book a cleaning service
   - You should see the payment form embedded in your site
   - Complete a test payment using Stripe's test card numbers

### Test Card Numbers

Use these test card numbers for testing:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

## Step 5: Verify Everything Works

1. **Check that bookings are created only after payment**
   - Complete a test payment
   - Check that the booking appears in your confirmed bookings
   - Verify the payment status is "completed"

2. **Test webhook processing**
   - Check your server logs for webhook processing
   - Verify that bookings move from pending to confirmed

## Vercel-Specific Configuration

### Important Notes for Vercel:

1. **Function Timeout**: The webhook function is configured with a 30-second timeout in `vercel.json`

2. **Environment Variables**: Make sure all environment variables are set in Vercel dashboard

3. **Webhook URL**: Use your Vercel domain for the webhook endpoint

4. **CORS Headers**: The webhook endpoint includes proper CORS headers for Vercel

5. **Logging**: Check Vercel function logs for webhook processing:
   - Go to your Vercel dashboard
   - Click on your project
   - Go to Functions tab
   - Look for `/api/webhooks/stripe` function logs

### Troubleshooting Vercel Webhooks:

1. **Webhook not receiving events**:
   - Verify the webhook URL is correct in Stripe dashboard
   - Check that the webhook is enabled
   - Ensure your Vercel app is deployed and accessible

2. **Webhook signature verification failing**:
   - Double-check `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
   - Make sure the secret matches the one in Stripe dashboard
   - Redeploy after changing environment variables

3. **Function timeout**:
   - Check Vercel function logs for timeout errors
   - The webhook function is configured for 30 seconds max
   - Optimize database operations if needed

## Troubleshooting

### "Payment processing is not configured"
- Make sure `STRIPE_SECRET_KEY` is set in your environment variables
- Ensure the key starts with `sk_test_` or `sk_live_`
- Restart your development server after adding the key

### "Webhook processing not configured"
- Make sure `STRIPE_WEBHOOK_SECRET` is set in your environment variables
- Ensure the secret starts with `whsec_`
- For local development, use Stripe CLI to get the webhook secret

### Payment not completing
- Check that your webhook endpoint is accessible
- Verify webhook events are being received
- Check server logs for webhook processing errors

### Booking not found after payment
- Ensure the webhook is processing the correct events
- Check that the booking ID in the webhook matches your pending booking
- Verify the payment status in Stripe Dashboard

### Vercel-specific issues:
- Check Vercel function logs for errors
- Verify environment variables are set correctly in Vercel dashboard
- Ensure your app is deployed and accessible
- Check that the webhook URL uses your Vercel domain

## Going Live

When you're ready to accept real payments:

1. **Switch to live mode**
   - Replace test keys with live keys in your Vercel environment variables
   - Update webhook endpoint to your production domain
   - Test thoroughly with small amounts first

2. **Update webhook endpoint**
   - Create a new webhook in Stripe Dashboard for your production domain
   - Update `STRIPE_WEBHOOK_SECRET` with the new webhook secret in Vercel

3. **Monitor payments**
   - Use Stripe Dashboard to monitor payments
   - Set up alerts for failed payments
   - Monitor webhook delivery in Stripe Dashboard
   - Check Vercel function logs regularly

## Security Notes

- **Never commit your Stripe keys to version control**
- **Use environment variables for all sensitive data**
- **Keep your webhook secret secure**
- **Use HTTPS in production (automatic with Vercel)**
- **Monitor your Stripe Dashboard regularly**
- **Set up proper logging and monitoring in Vercel**

## Support

If you encounter issues:

1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Review your Stripe Dashboard for payment status
3. Check your server logs for errors
4. Verify your environment variables are set correctly
5. Check Vercel function logs for webhook processing
6. Review the [Vercel Documentation](https://vercel.com/docs) for deployment issues
