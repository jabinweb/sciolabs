'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting sign in with:', { email })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        console.error('Sign in error:', result.error)
        setError('Invalid email or password')
        toast.error('Sign in failed: Invalid email or password')
      } else if (result?.ok) {
        console.log('Sign in successful, redirecting...')
        toast.success('Sign in successful! Redirecting...')
        
        // Use window.location for hard redirect to ensure session is properly loaded
        window.location.href = '/admin'
      } else {
        console.error('Unexpected result:', result)
        setError('An unexpected error occurred')
        toast.error('An unexpected error occurred')
      }
    } catch (err) {
      console.error('Sign in exception:', err)
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="font-heading text-2xl text-scio-blue">Sign In</CardTitle>
        <p className="font-body text-gray-600">Welcome back to ScioLabs</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-11 border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-11 border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-scio-blue hover:bg-scio-blue-dark text-white font-heading font-semibold transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-body text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-scio-blue hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
