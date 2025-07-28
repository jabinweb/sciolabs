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
    const folder = searchParams.get('folder') || undefined
    const mimeType = searchParams.get('type') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || undefined

    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      folder?: string
      mimeType?: { startsWith: string }
      OR?: Array<{
        filename?: { contains: string; mode: 'insensitive' }
        originalName?: { contains: string; mode: 'insensitive' }
        alt?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    if (folder) where.folder = folder
    if (mimeType) where.mimeType = { startsWith: mimeType }
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [files, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.mediaFile.count({ where })
    ])

    // Transform to match your MediaSelector interface
    const transformedFiles = files.map(file => ({
      id: file.id,
      name: file.filename,
      type: 'file' as const,
      size: file.size,
      mimeType: file.mimeType,
      url: file.url,
      path: file.path,
      createdAt: file.createdAt.toISOString(),
      uploadedBy: file.uploader,
      alt: file.alt,
      caption: file.caption,
      folder: file.folder
    }))

    return NextResponse.json({ 
      files: transformedFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}
   