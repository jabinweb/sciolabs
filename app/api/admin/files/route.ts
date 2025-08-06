import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/files - Get files and folders
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const mimeType = searchParams.get('type') || ''

    // Build where clause for filtering
    const where = {
      AND: [
        search ? {
          OR: [
            { filename: { contains: search, mode: 'insensitive' as const } },
            { originalName: { contains: search, mode: 'insensitive' as const } }
          ]
        } : {},
        mimeType ? { mimeType: { startsWith: mimeType } } : {}
      ]
    }

    const files = await prisma.mediaFile.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { folder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Transform files to match expected format
    const transformedFiles = files.map(file => ({
      id: file.id,
      name: file.originalName,
      type: 'file' as const,
      size: file.size,
      mimeType: file.mimeType,
      url: file.url,
      path: file.path,
      folder: file.folder,
      createdAt: file.createdAt.toISOString(),
      uploadedBy: {
        id: file.uploader.id,
        name: file.uploader.name || 'Unknown User'
      }
    }))

    return NextResponse.json({ files: transformedFiles })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/files - Delete multiple files
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileIds } = await request.json()

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: 'Invalid file IDs' }, { status: 400 })
    }

    // First, get the files to be deleted (for cleanup if needed)
    const filesToDelete = await prisma.mediaFile.findMany({
      where: {
        id: { in: fileIds }
      }
    })

    // Delete from database
    const deletedFiles = await prisma.mediaFile.deleteMany({
      where: {
        id: { in: fileIds }
      }
    })

    // Note: In a production environment, you might also want to delete the actual files
    // from your storage provider (Vercel Blob, AWS S3, etc.)

    return NextResponse.json({ 
      message: `${deletedFiles.count} files deleted successfully`,
      deletedCount: deletedFiles.count
    })
  } catch (error) {
    console.error('Error deleting files:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
