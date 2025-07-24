import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'

const updateBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required").optional(),
  isPublished: z.boolean().optional(),
  imageUrl: z.string().optional().nullable(),
  tags: z.string().optional(), // JSON string
  categoryId: z.string().optional().nullable(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const post = await prisma.blogPost.findFirst({
      where: { 
        id,
        isPublished: true
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
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
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: postId } = await params
    const body = await request.json()
    console.log('Updating post with data:', body)
    
    const validatedData = updateBlogPostSchema.parse(body)
    console.log('Validated update data:', validatedData)

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId }
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
        tagsString = existingPost.tags // Keep existing tags if invalid
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.content && { content: validatedData.content }),
        ...(validatedData.excerpt !== undefined && { excerpt: validatedData.excerpt }),
        ...(validatedData.slug && { slug: validatedData.slug }),
        ...(validatedData.isPublished !== undefined && { 
          isPublished: validatedData.isPublished,
          publishDate: validatedData.isPublished ? new Date() : null
        }),
        ...(validatedData.imageUrl !== undefined && { imageUrl: validatedData.imageUrl }),
        ...(tagsString !== undefined && { tags: tagsString }),
        ...(validatedData.categoryId !== undefined && { categoryId: validatedData.categoryId }),
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        category: true
      }
    })

    console.log('Updated blog post:', updatedPost)
    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Error updating post:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: postId } = await params

    await prisma.blogPost.delete({
      where: { id: postId }
    })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
