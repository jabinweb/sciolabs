import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Increment view count for the blog post
    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      views: post.views 
    })
  } catch (error) {
    console.error("Error updating view count:", error)
    return NextResponse.json(
      { error: "Failed to update view count" }, 
      { status: 500 }
    )
  }
}
