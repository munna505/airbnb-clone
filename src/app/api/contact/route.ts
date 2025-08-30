import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Send email to admin using SendGrid or Nodemailer
    // 2. Optionally save to database for tracking
    
    console.log('Contact form submission:', { name, email, message });

    // Mock email sending to admin
    await sendContactEmail({ name, email, message });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully. We\'ll get back to you soon!'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Mock email function (would use SendGrid or Nodemailer in real app)
async function sendContactEmail({ name, email, message }: any) {
  console.log('Sending contact email to admin...');
  console.log('From:', email);
  console.log('Name:', name);
  console.log('Message:', message);
  
  // In a real app, this would be:
  // await sendGrid.send({
  //   to: 'admin@cleanpro.com',
  //   from: 'noreply@cleanpro.com',
  //   subject: 'New Contact Form Submission - CleanPro',
  //   text: `
  //     Name: ${name}
  //     Email: ${email}
  //     Message: ${message}
  //   `,
  //   html: `
  //     <h2>New Contact Form Submission</h2>
  //     <p><strong>Name:</strong> ${name}</p>
  //     <p><strong>Email:</strong> ${email}</p>
  //     <p><strong>Message:</strong></p>
  //     <p>${message}</p>
  //   `
  // });
}
