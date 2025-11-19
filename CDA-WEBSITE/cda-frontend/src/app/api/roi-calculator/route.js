import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const formData = await request.json();

    const {
      monthlySales,
      monthlyOrders,
      monthlyTraffic,
      engagementRate,
      industry,
      name,
      email
    } = formData;

    // Validate required fields
    if (!monthlySales || !monthlyOrders || !monthlyTraffic || !engagementRate || !industry || !name || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailSubject = `New ROI Calculator Submission from ${name}`;
    const emailTextBody = `
New ROI Calculator Submission

Contact Information:
- Name: ${name}
- Email: ${email}

Business Metrics:
1. Monthly Web Sales: £${parseFloat(monthlySales).toFixed(2)}
2. Monthly Orders: ${monthlyOrders}
3. Monthly Website Traffic: ${monthlyTraffic}
4. Monthly Engagement Rate: ${engagementRate}%
5. Industry: ${industry}

---
This submission was received on ${new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long'
    })}
    `.trim();

    const emailHtmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #01E486; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; }
    .section { margin-bottom: 20px; }
    .section h2 { color: #01E486; border-bottom: 2px solid #01E486; padding-bottom: 10px; }
    .metric { padding: 10px; background-color: white; margin: 5px 0; border-left: 4px solid #01E486; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New ROI Calculator Submission</h1>
    </div>
    <div class="content">
      <div class="section">
        <h2>Contact Information</h2>
        <div class="metric"><strong>Name:</strong> ${name}</div>
        <div class="metric"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="section">
        <h2>Business Metrics</h2>
        <div class="metric"><strong>1. Monthly Web Sales:</strong> £${parseFloat(monthlySales).toFixed(2)}</div>
        <div class="metric"><strong>2. Monthly Orders:</strong> ${monthlyOrders}</div>
        <div class="metric"><strong>3. Monthly Website Traffic:</strong> ${monthlyTraffic.toLocaleString()}</div>
        <div class="metric"><strong>4. Monthly Engagement Rate:</strong> ${engagementRate}%</div>
        <div class="metric"><strong>5. Industry:</strong> ${industry}</div>
      </div>
    </div>
    <div class="footer">
      <p>This submission was received on ${new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'long'
      })}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email using nodemailer
    // Check if SMTP credentials are configured
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (hasSmtpConfig) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: 'stuart@cda.group',
          replyTo: email,
          subject: emailSubject,
          text: emailTextBody,
          html: emailHtmlBody,
        });

        console.log('Email sent successfully to stuart@cda.group');
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Log error but don't fail the request - we still want to acknowledge the submission
      }
    } else {
      // Log to console in development
      console.log('='.repeat(80));
      console.log('ROI Calculator Submission (SMTP not configured)');
      console.log('='.repeat(80));
      console.log('To: stuart@cda.group');
      console.log('From:', email);
      console.log('Subject:', emailSubject);
      console.log('\n' + emailTextBody);
      console.log('='.repeat(80));
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully',
        // In development, return the email content for testing
        debug: process.env.NODE_ENV === 'development' ? {
          to: 'stuart@cda.group',
          subject: emailSubject,
          smtpConfigured: hasSmtpConfig
        } : undefined
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('ROI Calculator API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
