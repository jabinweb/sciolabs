'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SignIn } from '@/components/auth/sign-in'
import { Suspense, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

function SignInForm() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const mode = searchParams.get('mode')
  const defaultMode = mode === 'signup' ? 'signup' : 'signin'

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-scio-blue" />
      </div>
    )
  }

  return (
    <SignIn callbackUrl={callbackUrl} defaultMode={defaultMode} />
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-scio-blue" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
