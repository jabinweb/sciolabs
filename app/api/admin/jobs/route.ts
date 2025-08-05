import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  qualifications: z.array(z.string()),
  location: z.string().min(1),
  workHours: z.string().min(1),
  payOut: z.string().min(1),
  type: z.enum(["Full-time", "Part-time", "Contract"]),
  experience: z.string().min(1),
  categoryId: z.string().optional(),
  applicationDeadline: z.string().optional(),
})

// GET /api/admin/jobs - Get all jobs
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const jobs = await prisma.job.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/admin/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createJobSchema.parse(body)

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingJob = await prisma.job.findUnique({
      where: { slug }
    })

    if (existingJob) {
      return NextResponse.json(
        { error: "A job with this title already exists" },
        { status: 400 }
      )
    }

    // Get department from category
    let department = 'General'
    if (validatedData.categoryId) {
      const category = await prisma.jobCategory.findUnique({
        where: { id: validatedData.categoryId }
      })
      if (category) {
        department = category.name
      }
    }

    const job = await prisma.job.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        qualifications: validatedData.qualifications,
        location: validatedData.location,
        workHours: validatedData.workHours,
        payOut: validatedData.payOut,
        department, // Use category name as department
        type: validatedData.type,
        experience: validatedData.experience,
        categoryId: validatedData.categoryId || null,
        applicationDeadline: validatedData.applicationDeadline 
          ? new Date(validatedData.applicationDeadline) 
          : null,
        createdBy: session.user.id!,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        }
      }
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating job:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
