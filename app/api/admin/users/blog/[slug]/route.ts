import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
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

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}
