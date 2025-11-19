# ROI Calculator Page

## Overview
The ROI Calculator page collects business metrics from users and sends the data via email to stuart@cda.group.

## Features
- **Hero Section Layout**: 1/3 left column (title, description, image) and 2/3 right column (form)
- **7-Question Form**: Collects business metrics and contact information
- **Form Validation**: Client-side validation for all fields
- **Email Notifications**: Sends formatted emails using nodemailer
- **Confirmation Page**: Shows success message after submission
- **Responsive Design**: Mobile-friendly layout

## Form Questions
1. **Monthly Web Sales** - Number input with currency (£) symbol
2. **Monthly Orders** - Number input
3. **Monthly Website Traffic** - Number input
4. **Monthly Engagement Rate** - Number input with percentage (%)
5. **Industry** - Dropdown select with predefined options
6. **Name** - Text input
7. **Email Address** - Email input with validation

## Email Configuration

### Required Environment Variables
Add these to your `.env.local` file:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # Your SMTP host
SMTP_PORT=587                      # SMTP port (587 for TLS, 465 for SSL)
SMTP_SECURE=false                  # true for 465, false for other ports
SMTP_USER=your-email@gmail.com    # SMTP username/email
SMTP_PASS=your-app-password       # SMTP password or app-specific password
SMTP_FROM=noreply@cda.group       # From address for emails
```

### Gmail Setup (Example)
If using Gmail:
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to Google Account Settings > Security
   - Select "2-Step Verification"
   - At the bottom, select "App passwords"
   - Generate a password for "Mail"
3. Use the generated password as `SMTP_PASS`

### Other SMTP Providers
- **SendGrid**: Use `smtp.sendgrid.net` on port `587`
- **Mailgun**: Use `smtp.mailgun.org` on port `587`
- **AWS SES**: Use `email-smtp.[region].amazonaws.com` on port `587`

## Development Mode
When SMTP is not configured, the form will:
- Still accept submissions
- Log email content to console
- Show success confirmation
- Not send actual emails

This allows for development and testing without SMTP setup.

## Files Structure
```
src/app/roi/
├── page.js                        # Main ROI Calculator page component
├── README.md                      # This file
└── api/
    └── roi-calculator/
        └── route.js               # API endpoint for form submission
```

## API Endpoint
**URL**: `/api/roi-calculator`
**Method**: `POST`
**Content-Type**: `application/json`

### Request Body
```json
{
  "monthlySales": "10000",
  "monthlyOrders": "500",
  "monthlyTraffic": "50000",
  "engagementRate": "3.5",
  "industry": "ecommerce",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response
```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

## Customization

### Changing the Recipient Email
Edit [route.js:113](../api/roi-calculator/route.js#L113):
```javascript
to: 'stuart@cda.group',  // Change this to your desired email
```

### Modifying Industry Options
Edit [page.js:262-273](page.js#L262-L273) to add/remove industry options.

### Updating Confirmation Message
Edit [page.js:118-122](page.js#L118-L122) to customize the success message.

### Styling
The page uses:
- Tailwind CSS classes for styling
- Green underline color `#01E486` (brand green)
- Standard button styles from `button-l` class
- Responsive grid layout

## Testing
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/roi`
3. Fill out the form
4. Check console for email output (if SMTP not configured)
5. Verify success message appears

## Production Deployment
Before deploying:
1. ✅ Configure SMTP environment variables in production
2. ✅ Test email sending in staging environment
3. ✅ Verify stuart@cda.group receives emails
4. ✅ Check form validation works correctly
5. ✅ Test responsive design on mobile devices

## Troubleshooting

### Emails not sending
- Check SMTP credentials in `.env.local`
- Verify SMTP port and security settings
- Check console for error messages
- Test SMTP credentials with a mail client

### Form validation errors
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Ensure email format is valid
- Check number inputs for positive values

### Styling issues
- Clear Next.js cache: `rm -rf .next`
- Restart development server
- Check Tailwind CSS configuration
- Verify image path is correct
