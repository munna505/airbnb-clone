# Forgot Password Feature Setup

This document explains the forgot password feature that has been implemented in the WelcomeFresh application.

## Overview

The forgot password feature allows users to reset their password by receiving a secure email link. The implementation includes:

1. **Database Schema Updates**: Added `resetPasswordToken` and `resetPasswordExpires` fields to the User model
2. **Email Templates**: Created a professional password reset email template
3. **API Endpoints**: Two new API routes for handling password reset requests
4. **User Interface**: Two new pages for the forgot password flow
5. **Security Features**: Token expiration, secure token generation, and email enumeration protection

## Files Added/Modified

### Database Schema
- `prisma/schema.prisma` - Added password reset fields to User model

### Email System
- `src/lib/email.ts` - Added password reset email template and sending function

### API Routes
- `src/app/api/auth/forgot-password/route.ts` - Handles password reset requests
- `src/app/api/auth/reset-password/route.ts` - Handles password reset completion

### User Interface
- `src/app/forgot-password/page.tsx` - Forgot password form page
- `src/app/reset-password/page.tsx` - Password reset form page
- `src/app/login/page.tsx` - Added "Forgot your password?" link

## How It Works

### 1. User Requests Password Reset
- User clicks "Forgot your password?" on the login page
- User enters their email address on the forgot password page
- System generates a secure random token and stores it in the database
- System sends an email with a reset link (valid for 1 hour)

### 2. User Resets Password
- User clicks the reset link in their email
- System validates the token and checks expiration
- User enters a new password (minimum 6 characters)
- System updates the password and clears the reset token

## Security Features

1. **Token Security**: Uses crypto.randomBytes(32) for secure token generation
2. **Token Expiration**: Reset tokens expire after 1 hour
3. **Email Enumeration Protection**: Always returns success message regardless of email existence
4. **Password Validation**: Minimum 6 character requirement
5. **Token Cleanup**: Reset tokens are cleared after successful password reset

## Email Template Features

- Professional design matching the WelcomeFresh brand
- Clear security information and instructions
- Fallback text version for email clients
- Responsive design for mobile devices
- Security warnings about token expiration

## Environment Variables Required

The following environment variables must be set for email functionality:

```env
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NEXTAUTH_URL=http://localhost:3000  # or your production URL
```

## Database Migration

After adding the new fields to the schema, run:

```bash
npx prisma db push
```

This will update your database with the new password reset fields.

## Testing the Feature

1. Go to the login page
2. Click "Forgot your password?"
3. Enter a valid email address
4. Check your email for the reset link
5. Click the link and set a new password
6. Try logging in with the new password

## Error Handling

The system handles various error scenarios:

- Invalid email format
- Expired reset tokens
- Missing tokens
- Password validation errors
- Email sending failures
- Database connection issues

All errors are logged for debugging while providing user-friendly error messages.

## Future Enhancements

Potential improvements for the future:

1. Rate limiting for password reset requests
2. Two-factor authentication integration
3. Password strength requirements
4. Account lockout after multiple failed attempts
5. Audit logging for security events
