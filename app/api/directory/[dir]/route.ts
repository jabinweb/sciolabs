import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dir: string }> }
) {
  try {
    const { dir } = await params
    
    // Validate directory name to prevent path traversal
    if (!dir || dir.includes('..') || dir.includes('/') || dir.includes('\\')) {
      return NextResponse.json({ error: "Invalid directory name" }, { status: 400 })
    }

    const publicPath = path.join(process.cwd(), 'public', dir)
    
    try {
      const files = await fs.readdir(publicPath)
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      )
      
      return NextResponse.json({ 
        directory: dir,
        images: imageFiles,
        count: imageFiles.length 
      })
    } catch {
      console.log(`Directory not found: ${dir}`)
      return NextResponse.json({ 
        directory: dir,
        images: [],
        count: 0,
        message: "Directory not found"
      })
    }
  } catch (error) {
    console.error("Error reading directory:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
