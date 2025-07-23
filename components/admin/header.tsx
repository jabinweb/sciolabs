import { Button } from '@/components/ui/button'
import { signOut, auth } from "@/auth"

export default async function AdminDashboardHeader() {
  const session = await auth()

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-heading text-3xl text-gray-800 mb-2">
          Welcome back, {session?.user?.name || session?.user?.email}!

        </h1>
        <p className="font-body text-gray-600">
          Manage your ScioLabs platform from this admin dashboard.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="text-right hidden sm:block">
          <p className="font-heading text-sm font-medium text-gray-800">
            {session?.user?.name || session?.user?.email}
          </p>
          <p className="text-xs text-gray-500 capitalize">{session?.user?.role}</p>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-scio-blue rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
          </span>
        </div>

        {/* Sign Out Button */}
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
