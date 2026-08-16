import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Toaster } from 'sonner'
import Sidebar from "@/components/admin/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function AdminDashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth()

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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8 lg:pt-10">
        <aside className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <Sidebar />
        </aside>
        <div className="flex min-w-0 flex-col">
          <main className="min-w-0 flex-1 pb-10">
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
