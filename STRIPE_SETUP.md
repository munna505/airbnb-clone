# Stripe Setup Guide

This application requires real Stripe payments to function. Follow this guide to set up Stripe properly.

## Prerequisites

- A Stripe account (sign up at [stripe.com](https://stripe.com))
- Node.js and npm installed
- This application cloned and running

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

1. **Create or edit `.env.local`** in your project root:
   ```env
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3001
   
   # Stripe Configuration (Required)
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

2. **Replace the placeholder values** with your actual Stripe keys

## Step 3: Set Up Webhook Endpoint

### For Production (when deployed):

1. **Create webhook in Stripe Dashboard**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select these events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Click "Add endpoint"

2. **Get the webhook secret**
   - After creating the webhook, click on it
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

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

## Troubleshooting

### "Payment processing is not configured"
- Make sure `STRIPE_SECRET_KEY` is set in your `.env.local`
- Ensure the key starts with `sk_test_` or `sk_live_`
- Restart your development server after adding the key

### "Webhook processing not configured"
- Make sure `STRIPE_WEBHOOK_SECRET` is set in your `.env.local`
- Ensure the secret starts with `whsec_`
- For local development, use Stripe CLI to get the webhook secret

### Payment not completing
- Check that your webhook endpoint is accessible
- Verify webhook events are being received
- Check server logs for webhook processing errors

### Booking not found after payment
- Ensure the webhook is processing `checkout.session.completed` events
- Check that the booking ID in the webhook matches your pending booking
- Verify the payment status in Stripe Dashboard

## Going Live

When you're ready to accept real payments:

1. **Switch to live mode**
   - Replace test keys with live keys in your environment variables
   - Update webhook endpoint to your production domain
   - Test thoroughly with small amounts first

2. **Update webhook endpoint**
   - Create a new webhook in Stripe Dashboard for your production domain
   - Update `STRIPE_WEBHOOK_SECRET` with the new webhook secret

3. **Monitor payments**
   - Use Stripe Dashboard to monitor payments
   - Set up alerts for failed payments
   - Monitor webhook delivery in Stripe Dashboard

## Security Notes

- **Never commit your Stripe keys to version control**
- **Use environment variables for all sensitive data**
- **Keep your webhook secret secure**
- **Use HTTPS in production**
- **Monitor your Stripe Dashboard regularly**

## Support

If you encounter issues:

1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Review your Stripe Dashboard for payment status
3. Check your server logs for errors
4. Verify your environment variables are set correctly
