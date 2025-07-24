import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required"),
  isPublished: z.boolean().default(false),
  imageUrl: z.string().optional().nullable(),
  tags: z.string().default("[]"), // Expecting JSON string
  categoryId: z.string().optional().nullable(),
})

// GET /api/admin/blog - Get blog posts or stats
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode")

    if (mode === "stats") {
      // Get stats and recent posts
      const [totalPosts, publishedPosts, totalViews, thisMonthPosts, recentPosts] = await Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { isPublished: true } }),
        prisma.blogPost.aggregate({ _sum: { views: true } }).then(result => result._sum.views || 0),
        prisma.blogPost.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        prisma.blogPost.findMany({
          include: {
            author: {
              select: {
                name: true,
                email: true
              }
            },
            category: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 50
        })
      ])

      // Parse tags for each post
      const postsWithParsedTags = recentPosts.map(post => {
        let parsedTags: string[] = []
        try {
          if (typeof post.tags === 'string') {
            parsedTags = JSON.parse(post.tags)
          } else if (Array.isArray(post.tags)) {
            parsedTags = post.tags
          }
        } catch (error) {
          console.error('Error parsing tags for post:', post.id, error)
          parsedTags = []
        }

        return {
          ...post,
          tags: parsedTags
        }
      })

      return NextResponse.json({
        stats: {
          totalPosts,
          publishedPosts,
          totalViews,
          thisMonthPosts
        },
        blogPosts: postsWithParsedTags
      })
    }

    // Default: return paginated posts
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const skip = (page - 1) * limit

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } }
          ]
        } : {},
        status === "published" ? { isPublished: true } : 
        status === "draft" ? { isPublished: false } : {}
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          category: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received blog post data:', body)
    
    const validatedData = createBlogPostSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 })
    }

    // Validate tags JSON string
    let tagsString = validatedData.tags
    try {
      const parsedTags = JSON.parse(tagsString)
      if (!Array.isArray(parsedTags)) {
        throw new Error('Tags must be an array')
      }
      // Re-stringify to ensure clean JSON
      tagsString = JSON.stringify(parsedTags)
    } catch (error) {
      console.error('Invalid tags JSON:', error)
      tagsString = "[]" // Default to empty array
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        slug: validatedData.slug,
        isPublished: validatedData.isPublished,
        publishDate: validatedData.isPublished ? new Date() : null,
        imageUrl: validatedData.imageUrl,
        tags: tagsString, // Store as JSON string
        authorId: session.user.id,
        categoryId: validatedData.categoryId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    })

    console.log('Created blog post:', blogPost)
    return NextResponse.json({ post: blogPost }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

