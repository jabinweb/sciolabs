import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name is too long"),
  description: z.string().optional(),
})

// GET /api/admin/settings/categories - Get all categories
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { blogPosts: true }
        }
      }
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/admin/settings/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    // Check if category with same name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name }
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
      }
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.issues }, { status: 400 })
    }

    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
