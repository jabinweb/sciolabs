import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Accepts any form, requires formName and data
const universalFormSchema = z.object({
  formName: z.string().min(1),
  data: z.record(z.string(), z.any()),
  email: z.email().optional(),
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

    await prisma.formResponse.create({
      data: {
        formName: parsed.formName,
        data: parsed.data,
        email: parsed.email,
        phone: parsed.phone,
        status: parsed.status ?? "new",
        tags: parsed.tags,
        source: parsed.source,
        userId: parsed.userId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    let errorMsg = "Unknown error"
    if (error instanceof Error) {
      errorMsg = error.message
    }
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 })
  }
}
