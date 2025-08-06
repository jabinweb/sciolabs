import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'
    const alt = formData.get('alt') as string || ''
    const caption = formData.get('caption') as string || ''
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }


    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`
    const folder = type || 'general'
    const blobPath = `${folder}/${filename}`

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: 'public',
    })

    // Save file record to database
    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename,
        originalName: file.name,
        path: blobPath,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
        alt: alt || null,
        caption: caption || null,
        folder,
        uploadedBy: session.user.id!,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({ 
      id: mediaFile.id,
      url: blob.url,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      alt: mediaFile.alt,
      caption: mediaFile.caption,
      folder: mediaFile.folder,
      uploadedBy: mediaFile.uploader
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
