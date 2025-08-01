import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const updateBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required").optional(),
  isPublished: z.boolean().optional(),
  imageUrl: z.string().optional().nullable(),
  tags: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(), // Add authorId to update schema
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const validatedData = updateBlogPostSchema.parse(body)

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug }
      })
      if (slugConflict) {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 })
      }
    }

    // Verify author exists if authorId is being updated
    if (validatedData.authorId) {
      const authorExists = await prisma.user.findUnique({
        where: { id: validatedData.authorId }
      })
      if (!authorExists) {
        return NextResponse.json({ error: "Selected author does not exist" }, { status: 400 })
      }
    }

    // Process tags if provided
    let tagsString = validatedData.tags
    if (tagsString !== undefined) {
      try {
        const parsedTags = JSON.parse(tagsString)
        if (!Array.isArray(parsedTags)) {
          throw new Error('Tags must be an array')
        }
        tagsString = JSON.stringify(parsedTags)
      } catch (error) {
        console.error('Invalid tags JSON:', error)
        tagsString = existingPost.tags
      }
    }

    // Build update data object using Prisma types
    const updateData: Prisma.BlogPostUpdateInput = {
      updatedAt: new Date()
    }

    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.content !== undefined) updateData.content = validatedData.content
    if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl
    if (tagsString !== undefined) updateData.tags = tagsString
    
    // Handle nullable fields properly
    if (validatedData.categoryId !== undefined) {
      updateData.category = validatedData.categoryId 
        ? { connect: { id: validatedData.categoryId } }
        : { disconnect: true }
    }
    
    if (validatedData.authorId !== undefined) {
      if (validatedData.authorId) {
        updateData.author = { connect: { id: validatedData.authorId } }
      }
      // Note: We don't disconnect author as it's required field
    }

    if (validatedData.isPublished !== undefined) {
      updateData.isPublished = validatedData.isPublished
      updateData.publishDate = validatedData.isPublished ? new Date() : null
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error updating post:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete the post
    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
