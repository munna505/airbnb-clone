#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Airbnb Clean - Environment Setup');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env.local file not found!');
  console.log('\n📝 Creating .env.local template...\n');
  
  const envTemplate = `# Database Configuration (Required)
# Get a free PostgreSQL database from Neon, Supabase, or Railway
DATABASE_URL="postgresql://username:password@localhost:5432/airbnb_clean"

# Stripe Configuration (Required for payments)
# Get your keys from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here

# Stripe Webhook Secret (Required for payment confirmation)
# Get this from Stripe Dashboard > Developers > Webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (Optional - for notifications)
# Gmail SMTP Configuration
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# SMS Configuration (Optional - for notifications)
# Get from Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# NextAuth Configuration (Required for authentication)
# Generate a random secret: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('📝 Please edit .env.local with your actual values\n');
} else {
  console.log('✅ .env.local file found');
}

// Check current environment variables
console.log('🔍 Checking environment variables...\n');

const requiredVars = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXTAUTH_SECRET'
];

const optionalVars = [
  'STRIPE_WEBHOOK_SECRET',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER'
];

console.log('Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${varName}: NOT SET`);
  }
});

console.log('\nOptional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ⚠️  ${varName}: NOT SET (optional)`);
  }
});

console.log('\n📋 Next Steps:');
console.log('1. Set up a PostgreSQL database (Neon, Supabase, or Railway)');
console.log('2. Get your Stripe API keys from https://dashboard.stripe.com/apikeys');
console.log('3. Update .env.local with your actual values');
console.log('4. Run: npm run db:setup');
console.log('5. Run: npm run dev');
console.log('\n📚 For detailed setup instructions, see:');
console.log('  - PRISMA_SETUP.md (Database setup)');
console.log('  - STRIPE_SETUP.md (Payment setup)');
