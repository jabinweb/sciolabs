'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

interface SignInProps {
  callbackUrl?: string
  title?: string
  allowRegistration?: boolean
  defaultMode?: 'signin' | 'signup'
}

export function SignIn({
  callbackUrl = '/admin',
  title = 'Sign In',
  allowRegistration = true,
  defaultMode = 'signin',
}: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(defaultMode === 'signup')
  const [showPassword, setShowPassword] = useState(false)

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignUp) {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to create account')
          return
        }

        const result = await signIn('credentials', {
          email,
          password,
          callbackUrl,
          redirect: false,
        })

        if (result?.error) {
          setError('Account created but sign-in failed. Please try signing in manually.')
        } else {
          window.location.href = callbackUrl
        }
      } catch {
        setError('Failed to create account. Please try again.')
      } finally {
        setIsLoading(false)
      }
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        window.location.href = callbackUrl
      }
    } catch {
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-0">
      <CardHeader className="text-center pb-6">
        <CardTitle className="font-heading text-2xl text-scio-blue">
          {isSignUp ? 'Create Account' : title}
        </CardTitle>
        <p className="font-body text-gray-600">
          {isSignUp ? 'Create your ScioLabs account' : 'Welcome back to ScioLabs'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-gray-300 focus:border-scio-orange focus:ring-scio-orange"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-gray-300 focus:border-scio-blue focus:ring-scio-blue pr-10"
                required
                minLength={isSignUp ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </>
            ) : isSignUp ? (
              'Sign Up'
            ) : (
              'Sign In'
            )}
          </Button>

          {allowRegistration && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                }}
                className="text-sm text-scio-blue hover:underline font-medium"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-scio-blue transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignIn
