import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { sendFormSubmissionNotification, sendAutoReply } from "@/lib/email"

// Accepts any form, requires formName and data
const universalFormSchema = z.object({
  formName: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  tags: z.string().optional(),
  source: z.string().optional(),
  userId: z.string().optional()
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = universalFormSchema.parse(body)

    // Save to database
    const formResponse = await prisma.formResponse.create({
      data: {
        formName: parsed.formName,
        data: parsed.data as Prisma.InputJsonValue, // Cast to Prisma's Json type
        email: parsed.email,
        phone: parsed.phone,
        status: parsed.status ?? "new",
        tags: parsed.tags,
        source: parsed.source,
        userId: parsed.userId
      }
    })

    // Prepare email data
    const emailData = {
      formName: parsed.formName,
      data: parsed.data,
      email: parsed.email,
      phone: parsed.phone,
      source: parsed.source,
      submittedAt: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // Send emails asynchronously (don't wait for them to complete)
    Promise.all([
      // Send notification to admin(s)
      sendFormSubmissionNotification(emailData).catch(error => {
        console.error('Failed to send admin notification:', error)
      }),
      
      // Send auto-reply to user if email provided
      parsed.email ? sendAutoReply(emailData).catch(error => {
        console.error('Failed to send auto-reply:', error)
      }) : Promise.resolve()
    ]).catch(error => {
      console.error('Email sending failed:', error)
      // Don't fail the request if emails fail
    })

    return NextResponse.json({ 
      success: true,
      id: formResponse.id,
      message: 'Form submitted successfully. You should receive a confirmation email shortly.'
    })
  } catch (error) {
    console.error('Form submission error:', error)
    let errorMsg = "Unknown error"
    if (error instanceof Error) {
      errorMsg = error.message
    }
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 })
  }
}
