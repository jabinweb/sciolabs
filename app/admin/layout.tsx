import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Toaster } from 'sonner'
import Sidebar from "@/components/admin/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function AdminDashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth()

  console.log('Admin Dashboard Layout - Session:', session);
  

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "admin") {
    redirect("/") // Redirect non-admin users to home
  }

  return (
    <div className="min-h-screen bg-gray-50"> {/* Add top padding for main header */}
      <div className="h-[80px] w-full flex justify-end bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] pt-10">
        {/* Sidebar Column */}
        <div className="bg-white border-r border-gray-200">
          <Sidebar />
        </div>
        
        {/* Main Content Column */}
        <div className="flex flex-col">

          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
      
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />
    </div>
  )
}
