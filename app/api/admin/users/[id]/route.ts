import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

// GET /api/admin/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        _count: {
          select: {
            sessions: true,
            blogPosts: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "admin"]).optional(),
  password: z.string().min(6).optional(),
})

// PUT /api/admin/users/[id] - Update user
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
    
    // Validate only provided fields
    const updateFields: Record<string, unknown> = {}
    
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.length < 2) {
        return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 })
      }
      updateFields.name = body.name
    }
    
    if (body.email !== undefined) {
      if (typeof body.email !== 'string' || !body.email.includes('@')) {
        return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
      }
      updateFields.email = body.email
    }
    
    if (body.role !== undefined) {
      if (!['user', 'admin'].includes(body.role)) {
        return NextResponse.json({ error: "Role must be 'user' or 'admin'" }, { status: 400 })
      }
      updateFields.role = body.role
    }
    
    if (body.password !== undefined && body.password !== '') {
      if (typeof body.password !== 'string' || body.password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }
      updateFields.password = await bcrypt.hash(body.password, 12)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check email uniqueness if email is being updated
    if (updateFields.email && updateFields.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateFields.email as string }
      })
      if (emailExists) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateFields,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Delete user
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

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
