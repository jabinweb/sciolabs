import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name is too long"),
  description: z.string().optional(),
})

// PUT /api/admin/settings/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if another category with the same name exists
    if (validatedData.name !== existingCategory.name) {
      const nameConflict = await prisma.category.findUnique({
        where: { name: validatedData.name }
      })
      if (nameConflict) {
        return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.issues }, { status: 400 })
    }

    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/admin/settings/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { blogPosts: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if category has blog posts
    if (existingCategory._count.blogPosts > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category because it has ${existingCategory._count.blogPosts} blog post(s)` 
      }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
