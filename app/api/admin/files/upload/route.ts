import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = (formData.get('path') as string) || null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadResults = []

    for (const file of files) {
      try {
        // Generate unique filename
        const fileExtension = file.name.split('.').pop()
        const uniqueFilename = `${nanoid()}.${fileExtension}`
        const path = folder ? `${folder}/${uniqueFilename}` : uniqueFilename

        // Upload to Vercel Blob
        const blob = await put(path, file, {
          access: 'public',
        })

        // Save to database
        const mediaFile = await prisma.mediaFile.create({
          data: {
            filename: uniqueFilename,
            originalName: file.name,
            path: blob.pathname,
            url: blob.url,
            mimeType: file.type,
            size: file.size,
            folder: folder,
            uploadedBy: session.user.id!
          }
        })

        uploadResults.push(mediaFile)
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        // Continue with other files
      }
    }

    return NextResponse.json({
      message: `${uploadResults.length} files uploaded successfully`,
      uploadedCount: uploadResults.length,
      files: uploadResults
    })

  } catch (error) {
    console.error("Error in file upload:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
      