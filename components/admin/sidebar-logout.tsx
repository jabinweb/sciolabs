'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/auth/signin',
        redirect: true 
      })
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out')
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="w-full text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-200"
    >
      <i className="fas fa-sign-out-alt mr-2"></i>
      Logout
    </Button>
  )
}
