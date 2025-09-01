# Gmail SMTP Setup Guide

This guide will help you configure Gmail SMTP for sending email notifications in your CleanPro application.

## Prerequisites

- A Gmail account
- 2-Factor Authentication enabled on your Gmail account

## Step 1: Enable 2-Factor Authentication

1. **Go to your Google Account settings**: [myaccount.google.com](https://myaccount.google.com)
2. **Navigate to Security**
3. **Enable 2-Step Verification** if not already enabled
4. **This is required to generate App Passwords**

## Step 2: Generate an App Password

1. **Go to Google Account settings**: [myaccount.google.com](https://myaccount.google.com)
2. **Navigate to Security**
3. **Find "App passwords"** (under 2-Step Verification)
4. **Click "App passwords"**
5. **Select "Mail"** as the app
6. **Select "Other (Custom name)"** as the device
7. **Enter a name** like "CleanPro App"
8. **Click "Generate"**
9. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   **Important**: Remove all spaces when adding to your .env file

## Step 3: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

**Important Notes:**
- Use your full Gmail address (e.g., `john.doe@gmail.com`)
- Use the App Password, NOT your regular Gmail password
- **Remove ALL spaces from the App Password** (e.g., `abcd efgh ijkl mnop` becomes `abcdefghijklmnop`)

## Step 4: Test the Configuration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Register a new user** or **log in** to test email functionality

3. **Check the console logs** for email sending status

## Email Types Sent

The application will automatically send emails for:

### 1. Welcome Email (Signup)
- **When**: User registers a new account
- **Content**: Welcome message, features overview, call-to-action

### 2. Login Notification Email
- **When**: User successfully logs in
- **Content**: Security alert with login details and timestamp

### 3. Payment Confirmation Email
- **When**: Payment is completed successfully
- **Content**: Booking confirmation with all details

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Ensure you're using the App Password, not your regular password
   - Verify 2-Factor Authentication is enabled

2. **"Username and Password not accepted"**
   - Check that your Gmail address is correct
   - Ensure the App Password is copied correctly (remove all spaces)

3. **"Less secure app access" error**
   - This is expected - App Passwords are the secure way to access Gmail
   - Make sure you're using the App Password, not your regular password

4. **Emails not sending**
   - Check console logs for error messages
   - Verify environment variables are set correctly
   - Ensure your Gmail account isn't suspended

### Security Best Practices

1. **Never commit your App Password to version control**
2. **Use environment variables** for all sensitive data
3. **Regularly rotate your App Password** if needed
4. **Monitor your Gmail account** for any suspicious activity

### Production Deployment

For production deployment:

1. **Use a dedicated Gmail account** for sending emails
2. **Set up proper SPF/DKIM records** for your domain
3. **Consider using a transactional email service** like SendGrid for high volume
4. **Monitor email delivery rates** and bounce rates

## Alternative Email Services

If you prefer not to use Gmail, you can modify the email service to use:

- **SendGrid** (already configured in the project)
- **Mailgun**
- **Amazon SES**
- **Postmark**

## Email Templates

The application includes beautiful, responsive email templates for:

- Welcome emails with branding and feature highlights
- Security notifications with login details
- Payment confirmations with booking information

All templates are mobile-friendly and include both HTML and plain text versions.

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify your Gmail configuration
3. Test with a simple email first
4. Ensure your environment variables are correctly set

For additional help, refer to the [Gmail SMTP documentation](https://support.google.com/mail/answer/7126229).
