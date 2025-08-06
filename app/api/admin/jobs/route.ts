import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

// GET /api/admin/jobs - Get all jobs (public endpoint for job listings)
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching jobs from database...')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const activeOnly = searchParams.get("activeOnly") !== "false" // Default to true
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where = activeOnly ? { isActive: true } : {}
    
    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ])
    
    console.log(`Found ${jobs.length} jobs in database`)
    
    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

const createJobSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  qualifications: z.array(z.string()),
  location: z.string().min(1),
  workHours: z.string().min(1),
  payOut: z.string().min(1),
  department: z.string().min(1),
  type: z.string().min(1),
  experience: z.string().min(1),
  isActive: z.boolean().default(true),
  applicationDeadline: z.string().datetime().optional(),
  categoryId: z.string().optional()
})

// POST /api/admin/jobs - Create new job (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const validatedData = createJobSchema.parse(body)
    
    // Check if slug already exists
    const existingJob = await prisma.job.findUnique({
      where: { slug: validatedData.slug }
    })
    
    if (existingJob) {
      return NextResponse.json(
        { error: "A job with this slug already exists" },
        { status: 400 }
      )
    }
    
    const job = await prisma.job.create({
      data: {
        ...validatedData,
        qualifications: validatedData.qualifications,
        applicationDeadline: validatedData.applicationDeadline 
          ? new Date(validatedData.applicationDeadline) 
          : null,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
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
