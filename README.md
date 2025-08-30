# CleanPro - Professional Cleaning Service Booking App

A modern, responsive web application for booking professional cleaning services. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏠 Home Cleaning Service
- Customizable booking based on bedrooms, bathrooms, and living areas
- Real-time price calculation
- Flexible scheduling options
- Professional cleaning checklist

### 🏢 Airbnb Cleaning Service
- Specialized turnover cleaning for vacation rentals
- Linen and towel service add-ons
- Bed size customization
- Guest-ready property guarantee

### 💳 Payment Integration
- Stripe payment processing with embedded payment form
- Secure checkout experience within your site
- Real-time payment validation

### 📧 Communication
- Email confirmations (SendGrid/Nodemailer)
- SMS notifications (Twilio)
- Contact form for customer support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Payments**: Stripe + Afterpay
- **Email**: SendGrid/Nodemailer
- **SMS**: Twilio

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd airbnb-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # Stripe Configuration (Required for payments)
   STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_actual_stripe_webhook_secret_here
   
   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   
   # SMS Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Database (if using PostgreSQL/MySQL)
   DATABASE_URL=your_database_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── bookings/          # Booking management
│   │   ├── contact/           # Contact form
│   │   ├── notify/            # Email/SMS notifications
│   │   ├── payment/           # Stripe integration
│   │   └── pricing/           # Pricing data
│   ├── book/                  # Booking pages
│   │   ├── home/             # Home cleaning booking
│   │   └── airbnb/           # Airbnb cleaning booking
│   ├── confirmation/          # Booking confirmation
│   ├── contact/              # Contact page
│   ├── services/             # Services information
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/                # Reusable components
│   └── BookingForm.tsx       # Main booking form
└── types/                    # TypeScript type definitions
```

## API Endpoints

### Bookings
- `POST /api/bookings` - **Deprecated** - Bookings must be created through payment flow
- `GET /api/bookings` - Get all confirmed bookings
- `GET /api/bookings/[id]` - Get specific booking (pending or confirmed)

### Payments
- `POST /api/payment` - Create payment session with booking data
- `POST /api/webhooks/stripe` - Stripe webhook for payment confirmations

### Pricing
- `GET /api/pricing` - Get pricing information
- `GET /api/pricing?serviceType=home` - Get home cleaning pricing
- `GET /api/pricing?serviceType=airbnb` - Get Airbnb cleaning pricing

### Notifications
- `POST /api/notify` - Send email/SMS notifications

### Notifications
- `POST /api/notify` - Send email/SMS notifications

### Contact
- `POST /api/contact` - Submit contact form

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  service_type ENUM('home', 'airbnb') NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  living_areas INT NOT NULL,
  bed_sizes JSON,
  addons JSON,
  price DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  date_time DATETIME NOT NULL,
  payment_status ENUM('pending', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Pricing Table
```sql
CREATE TABLE pricing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_type ENUM('home', 'airbnb') NOT NULL,
  key VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Payment-First Flow

This application implements a payment-first booking system to ensure orders are only created after payment confirmation:

### Flow Overview
1. **User fills booking form** → Collects all booking details
2. **Create Stripe payment session** → Stores booking data in pending state, redirects to Stripe
3. **User completes payment on Stripe** → Real payment processing via Stripe
4. **Stripe webhook confirms payment** → Only after successful payment, booking moves to confirmed status
5. **User sees confirmation** → Only paid bookings show confirmation page

### Important Notes
- **Real payments only** - No mock payments or development fallbacks
- **Stripe required** - Application will not function without proper Stripe configuration
- **Webhook required** - Bookings are only confirmed after webhook processes payment success

### Benefits
- ✅ **No orphaned bookings** - Orders only exist if payment was successful
- ✅ **Proper payment verification** - Webhook ensures payment was actually completed
- ✅ **Clean data** - Failed payments don't create bookings in the system
- ✅ **Better user experience** - Clear payment-first flow

## Stripe Setup (Required)

This application requires real Stripe payments and cannot function without proper Stripe configuration.

### 1. Create a Stripe Account
- Sign up at [stripe.com](https://stripe.com)
- Get your API keys from the Stripe Dashboard

### 2. Configure Environment Variables
Add your Stripe keys to `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
```

### 3. Set Up Webhook Endpoint
1. **Create a webhook endpoint in Stripe Dashboard**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Get the webhook secret**
   - Copy the webhook signing secret from the webhook details
   - Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

3. **Test the webhook locally**
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Login: `stripe login`
   - Forward webhooks: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`

## Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BASE_URL` | Your app's base URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_test_` or `sk_live_`) | **Yes** |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with `pk_test_` or `pk_live_`) | **Yes** |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (starts with `whsec_`) | **Yes** |
| `SENDGRID_API_KEY` | SendGrid API key | No |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No |
| `DATABASE_URL` | Database connection string | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@cleanpro.com or create an issue in this repository.

## Roadmap

- [ ] Admin dashboard with analytics
- [ ] Automated booking assignments
- [ ] Editable pricing via admin panel
- [ ] Customer reviews and ratings
- [ ] Recurring booking options
- [ ] Mobile app development
- [ ] Integration with property management systems
