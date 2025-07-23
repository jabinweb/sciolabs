'use client'

import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/" })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full text-red-600 border-red-600 hover:bg-red-50"
      onClick={handleLogout}
    >
      <i className="fas fa-sign-out-alt mr-2"></i>
      Logout
    </Button>
  )
}
