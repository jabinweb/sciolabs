import nodemailer from 'nodemailer'

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

interface FormSubmissionData {
  formName: string
  data: Record<string, unknown>
  email?: string
  phone?: string
  source?: string
  submittedAt: string
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

// Send email function
export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'ScioLabs'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Generate HTML template for form submission notification
export function generateFormSubmissionHTML(data: FormSubmissionData): string {
  const { formName, data: formData, email, phone, source, submittedAt } = data
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Form Submission - ${formName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5296, #4a6bb3); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #2d5296; }
        .field-name { font-weight: bold; color: #2d5296; margin-bottom: 5px; }
        .field-value { color: #555; word-break: break-word; }
        .meta-info { background: #e2e8f0; padding: 15px; border-radius: 0 0 8px 8px; font-size: 0.9em; color: #666; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .form-type { background: #f99f1b; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.8em; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ScioLabs</div>
        <h2>New Form Submission</h2>
        <span class="form-type">${formName.toUpperCase()}</span>
      </div>
      
      <div class="content">
        <h3>Submission Details:</h3>
        
        ${Object.entries(formData).map(([key, value]) => `
          <div class="field">
            <div class="field-name">${formatFieldName(key)}:</div>
            <div class="field-value">${formatFieldValue(key, value)}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="meta-info">
        <strong>Submission Information:</strong><br>
        <strong>Date:</strong> ${submittedAt}<br>
        ${email ? `<strong>Email:</strong> ${email}<br>` : ''}
        ${phone ? `<strong>Phone:</strong> ${phone}<br>` : ''}
        ${source ? `<strong>Source:</strong> ${source}<br>` : ''}
        <strong>Form Type:</strong> ${formName}
      </div>
    </body>
    </html>
  `
}

// Generate auto-reply HTML template
export function generateAutoReplyHTML(formName: string, userName?: string): string {
  const name = userName || 'there'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting ScioLabs</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5296, #4a6bb3); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 0.9em; color: #666; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .highlight { color: #f99f1b; font-weight: bold; }
        .contact-info { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ScioLabs</div>
        <h2>Thank You for Your Submission!</h2>
      </div>
      
      <div class="content">
        <h3>Hi ${name},</h3>
        
        <p>Thank you for reaching out to ScioLabs! We've received your <strong>${formName}</strong> submission and appreciate your interest in our services.</p>
        
        <p>Our team will review your message and get back to you within <span class="highlight">24-48 hours</span> during business days.</p>
        
        <div class="contact-info">
          <h4>In the meantime, here are some ways to connect with us:</h4>
          <p>
            📧 <strong>Email:</strong> info@sciolabs.in<br>
            📞 <strong>Phone:</strong> +91 9495212484<br>
            🌐 <strong>Website:</strong> <a href="https://sciolabs.in">www.sciolabs.in</a><br>
            📍 <strong>Address:</strong> N-304, Ashiyana Sector – N, Lucknow – 226012, India
          </p>
        </div>
        
        <p>We're excited to help you on your educational journey and look forward to speaking with you soon!</p>
        
        <p>Best regards,<br>
        <strong>The ScioLabs Team</strong></p>
      </div>
      
      <div class="footer">
        <p>This is an automated response. Please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} ScioLabs. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

// Helper functions
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/id$/i, 'ID')
    .replace(/url$/i, 'URL')
    .replace(/cv$/i, 'CV')
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '<em>Not provided</em>'
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  
  if (typeof value === 'object') {
    return `<pre>${JSON.stringify(value, null, 2)}</pre>`
  }
  
  const stringValue = String(value)
  
  // Format URLs as links
  if (key.toLowerCase().includes('url') && stringValue.startsWith('http')) {
    return `<a href="${stringValue}" target="_blank">${stringValue}</a>`
  }
  
  // Format emails as mailto links
  if (key.toLowerCase().includes('email') && stringValue.includes('@')) {
    return `<a href="mailto:${stringValue}">${stringValue}</a>`
  }
  
  // Format phones as tel links
  if (key.toLowerCase().includes('phone')) {
    return `<a href="tel:${stringValue}">${stringValue}</a>`
  }
  
  // Format long text in paragraphs
  if (stringValue.length > 100) {
    return `<div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${stringValue}</div>`
  }
  
  return stringValue
}

// Send form submission notification
export async function sendFormSubmissionNotification(formData: FormSubmissionData) {
  const adminEmails = process.env.ADMIN_NOTIFICATION_EMAILS?.split(',').map(email => email.trim()) || ['info@sciolabs.in']
  
  const subject = `New ${formData.formName} Submission - ScioLabs`
  const html = generateFormSubmissionHTML(formData)
  
  const results = []
  
  for (const email of adminEmails) {
    const result = await sendEmail({
      to: email,
      subject,
      html
    })
    results.push({ email, ...result })
  }
  
  return results
}

// Send auto-reply to user
export async function sendAutoReply(formData: FormSubmissionData) {
  if (!formData.email) {
    return { success: false, error: 'No email provided for auto-reply' }
  }
  
  // Extract user name from form data
  const userName = (formData.data.firstName as string) || 
                  (formData.data.name as string) || 
                  formData.email.split('@')[0]
  
  const subject = `Thank you for contacting ScioLabs`
  const html = generateAutoReplyHTML(formData.formName, userName)
  
  return await sendEmail({
    to: formData.email,
    subject,
    html
  })
}
