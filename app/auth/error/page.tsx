'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const errorMessages = {
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect.',
    suggestion: 'Please check your credentials and try again.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'There was a problem with authentication.',
    suggestion: 'Please try again or contact support if the issue persists.',
  },
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'

  const errorInfo =
    errorMessages[error as keyof typeof errorMessages] || errorMessages.Default

  return (
    <Card className="w-full max-w-md shadow-2xl border-0">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <CardTitle className="font-heading text-xl text-gray-900">{errorInfo.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-center">{errorInfo.description}</p>
        <p className="text-sm text-gray-500 text-center">{errorInfo.suggestion}</p>

        <div className="flex flex-col gap-2 pt-4">
          <Button asChild className="w-full bg-scio-blue hover:bg-scio-blue-dark">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-xl text-gray-900">Loading...</CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
