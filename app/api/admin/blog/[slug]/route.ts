import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const post = await prisma.blogPost.findFirst({
      where: { 
        slug,
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

    // Parse tags safely
    const formattedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}
