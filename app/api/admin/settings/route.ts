import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSettings, updateMultipleSettings, initializeSettings } from "@/lib/settings"

// GET /api/admin/settings
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize settings if needed
    await initializeSettings()

    const settings = await getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log('Settings update request received')
    
    // Check if updating specific category or multiple categories
    const categories = Object.keys(body)
    const validCategories = ['general', 'email', 'seo', 'maintenance', 'features', 'security']
    
    // Validate that all categories are valid
    const invalidCategories = categories.filter(cat => !validCategories.includes(cat))
    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { error: `Invalid categories: ${invalidCategories.join(', ')}` },
        { status: 400 }
      )
    }
    
    console.log('Updating categories:', categories)
    
    // Always use updateMultipleSettings for consistency
    console.log('Updating multiple categories')
    await updateMultipleSettings(body)
    
    // Return updated settings
    const updatedSettings = await getSettings()
    
    return NextResponse.json({ 
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error("Error details:", { message: errorMessage, stack: errorStack })
    
    // Handle specific database errors
    if (errorMessage.includes('Database configuration error')) {
      return NextResponse.json(
        { 
          error: "Database configuration error", 
          details: "Please run database setup commands",
          solution: "Run: npx prisma generate && npx prisma db push"
        },
        { status: 500 }
      )
    }
    
    if (errorMessage.includes('Database connection error')) {
      return NextResponse.json(
        { 
          error: "Database connection error", 
          details: "Unable to connect to the database",
          solution: "Check your DATABASE_URL and database server status"
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: errorMessage,
        // Only include stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    )
  }
}
