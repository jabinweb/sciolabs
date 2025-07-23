import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode')

    if (mode === 'stats') {
      // Get blog statistics
      const [totalPosts, publishedPosts, totalViews, thisMonthPosts] = await Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { isPublished: true } }),
        prisma.blogPost.aggregate({ _sum: { views: true } }),
        prisma.blogPost.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ])

      // Get all blog posts for listing
      const blogPosts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
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

      // Format posts with safe tags parsing
      const formattedPosts = blogPosts.map(post => ({
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
        author: post.author || { name: null, email: '' },
        category: post.category || null
      }))

      return NextResponse.json({
        blogPosts: formattedPosts,
        stats: {
          totalPosts,
          publishedPosts,
          totalViews: totalViews._sum.views || 0,
          thisMonthPosts
        },
        success: true
      })
    }

    // Default: return all posts
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        slug: true,
        isPublished: true,
        publishDate: true,
        imageUrl: true,
        tags: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true,
            image: true
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

    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      author: post.author || { name: null, email: '', image: null },
      category: post.category || null
    }))

    return NextResponse.json({ 
      posts: formattedPosts,
      success: true 
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ 
      posts: [],
      success: false,
      error: 'Failed to fetch blog posts' 
    }, { status: 500 })
  }
}
