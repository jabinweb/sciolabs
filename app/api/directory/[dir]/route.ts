import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dir: string }> }
) {
  try {
    const { dir } = await params
    
    // Validate directory name for security
    const allowedDirectories = ['ScioGuidance', 'ScioSprints', 'ScioThrive']
    if (!allowedDirectories.includes(dir)) {
      return NextResponse.json({ error: "Directory not allowed" }, { status: 403 })
    }

    const directoryPath = path.join(process.cwd(), 'public', dir)
    
    try {
      const files = await fs.readdir(directoryPath)
      
      // Filter for image files
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tiff']
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      })

      return NextResponse.json({ images })
    } catch (error) {
      // Directory doesn't exist or is empty
      return NextResponse.json({ images: [] })
    }
  } catch (error) {
    console.error("Error reading directory:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
