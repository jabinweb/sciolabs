import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromName, smtpFromEmail } = body

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    // Send test email
    const testEmail = {
      from: `"${smtpFromName}" <${smtpFromEmail}>`,
      to: session.user.email!,
      subject: 'SMTP Test Email - ScioLabs',
      html: `
        <h2>SMTP Configuration Test</h2>
        <p>If you're reading this, your SMTP configuration is working correctly!</p>
        <p><strong>Test Details:</strong></p>
        <ul>
          <li>SMTP Host: ${smtpHost}</li>
          <li>SMTP Port: ${smtpPort}</li>
          <li>From: ${smtpFromName} &lt;${smtpFromEmail}&gt;</li>
          <li>Test performed at: ${new Date().toLocaleString()}</li>
        </ul>
        <hr>
        <p><small>This is an automated test email from ScioLabs Admin Panel.</small></p>
      `
    }

    await transporter.sendMail(testEmail)

    return NextResponse.json({ 
      success: true,
      message: "Test email sent successfully" 
    })
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}
