import nodemailer from 'nodemailer';

// Email transporter configuration using Google SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
};

// Email templates
const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to CleanPro - Your Account is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to CleanPro! 🧹</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Professional Cleaning Services</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for creating your account with CleanPro! We're excited to have you on board and ready to help keep your space spotless.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>📅 Book home cleaning services</li>
              <li>🏠 Schedule Airbnb turnover cleaning</li>
              <li>💳 Make secure payments</li>
              <li>📱 Track your bookings</li>
              <li>📧 Receive booking confirmations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Start Booking Now
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions or need assistance, don't hesitate to contact our support team.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The CleanPro Team
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 CleanPro. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
Welcome to CleanPro! 🧹

Hi ${name},

Thank you for creating your account with CleanPro! We're excited to have you on board and ready to help keep your space spotless.

What you can do now:
- 📅 Book home cleaning services
- 🏠 Schedule Airbnb turnover cleaning
- 💳 Make secure payments
- 📱 Track your bookings
- 📧 Receive booking confirmations

Start booking now: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}

If you have any questions or need assistance, don't hesitate to contact our support team.

Best regards,
The CleanPro Team

© 2024 CleanPro. All rights reserved.
    `
  }),

  login: (name: string, email: string, timestamp: string) => ({
    subject: 'New Login to Your CleanPro Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Account Login Alert</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">CleanPro Security Notification</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            We detected a new login to your CleanPro account. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0;">Login Details:</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Time:</strong> ${timestamp}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745;">✅ Successful</span></p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If this was you, you can safely ignore this email. If you didn't log in to your account, please contact us immediately.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Account
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            For security reasons, we recommend:
          </p>
          <ul style="color: #666; line-height: 1.8;">
            <li>Using a strong, unique password</li>
            <li>Enabling two-factor authentication if available</li>
            <li>Never sharing your login credentials</li>
          </ul>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The CleanPro Security Team
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 CleanPro. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
🔐 Account Login Alert

Hi ${name},

We detected a new login to your CleanPro account. Here are the details:

Login Details:
- Email: ${email}
- Time: ${timestamp}
- Status: ✅ Successful

If this was you, you can safely ignore this email. If you didn't log in to your account, please contact us immediately.

View your account: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile

For security reasons, we recommend:
- Using a strong, unique password
- Enabling two-factor authentication if available
- Never sharing your login credentials

Best regards,
The CleanPro Security Team

© 2024 CleanPro. All rights reserved.
    `
  }),

  paymentComplete: (name: string, bookingDetails: Record<string, unknown>) => ({
    subject: 'Payment Confirmed - Your CleanPro Booking is Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✅ Payment Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your CleanPro booking is now confirmed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Great news! Your payment has been processed successfully and your cleaning service is now confirmed. Here are your booking details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Service Type:</strong> ${bookingDetails.serviceType}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${bookingDetails.date}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Time:</strong> ${bookingDetails.time}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Address:</strong> ${bookingDetails.address}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> $${bookingDetails.price}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Booking ID:</strong> ${bookingDetails.id}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Our team will contact you 24 hours before your scheduled service</li>
              <li>Please ensure someone is available at the address during the scheduled time</li>
              <li>You'll receive a reminder email the day before your service</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View My Bookings
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions or need to make changes to your booking, please contact us as soon as possible.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for choosing CleanPro! We look forward to serving you.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The CleanPro Team
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 CleanPro. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
✅ Payment Confirmed!

Hi ${name},

Great news! Your payment has been processed successfully and your cleaning service is now confirmed. Here are your booking details:

Booking Details:
- Service Type: ${bookingDetails.serviceType}
- Date: ${bookingDetails.date}
- Time: ${bookingDetails.time}
- Address: ${bookingDetails.address}
- Total Amount: $${bookingDetails.price}
- Booking ID: ${bookingDetails.id}

What's Next?
- Our team will contact you 24 hours before your scheduled service
- Please ensure someone is available at the address during the scheduled time
- You'll receive a reminder email the day before your service

View your bookings: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders

If you have any questions or need to make changes to your booking, please contact us as soon as possible.

Thank you for choosing CleanPro! We look forward to serving you.

Best regards,
The CleanPro Team

© 2024 CleanPro. All rights reserved.
    `
  })
};

// Email sending function
export const sendEmail = async (to: string, template: keyof typeof emailTemplates, data: Record<string, unknown>) => {
  try {
    // Check if email is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Email not configured - skipping email send');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    let emailTemplate;
    
    // Handle different template types
    if (template === 'welcome') {
      emailTemplate = emailTemplates.welcome(data as unknown as string);
    } else if (template === 'login') {
      emailTemplate = emailTemplates.login(
        data.name as unknown as string, 
        data.email as unknown as string, 
        data.timestamp as unknown as string
      );
    } else if (template === 'paymentComplete') {
      emailTemplate = emailTemplates.paymentComplete(
        data.name as unknown as string, 
        data as unknown as Record<string, unknown>
      );
    } else {
      throw new Error(`Unknown email template: ${template}`);
    }
    
    const mailOptions = {
      from: `"CleanPro" <${process.env.GMAIL_USER}>`,
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('📧 Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Specific email functions
export const sendWelcomeEmail = async (name: string, email: string) => {
  return sendEmail(email, 'welcome', name as unknown as Record<string, unknown>);
};

export const sendLoginEmail = async (name: string, email: string) => {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return sendEmail(email, 'login', { name, email, timestamp });
};

export const sendPaymentCompleteEmail = async (name: string, email: string, bookingDetails: Record<string, unknown>) => {
  return sendEmail(email, 'paymentComplete', { name, ...bookingDetails });
};
