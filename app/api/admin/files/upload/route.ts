import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const uploadPath = formData.get('path') as string || '/'
    const folder = uploadPath === '/' ? 'general' : uploadPath.replace(/^\//, '')
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({ error: `File ${file.name} is too large` }, { status: 400 })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${extension}`
      const blobPath = `${folder}/${filename}`

      try {
        // Upload to Vercel Blob
        const blob = await put(blobPath, file, {
          access: 'public',
        })

        // Save to database
        const mediaFile = await prisma.mediaFile.create({
          data: {
            filename,
            originalName: file.name,
            path: blobPath,
            url: blob.url,
            mimeType: file.type,
            size: file.size,
            folder,
            uploadedBy: session.user.id!,
          }
        })

        uploadedFiles.push({
          id: mediaFile.id,
          name: filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          url: blob.url,
          folder: mediaFile.folder
        })
      } catch (uploadError) {
        console.error(`Error uploading ${file.name}:`, uploadError)
        return NextResponse.json({ 
          error: `Failed to upload ${file.name}` 
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      uploadedCount: uploadedFiles.length,
      files: uploadedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
