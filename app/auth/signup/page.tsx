import { redirect } from 'next/navigation'

interface SignUpPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams
  const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : undefined
  const query = callbackUrl
    ? `?mode=signup&callbackUrl=${encodeURIComponent(callbackUrl)}`
    : '?mode=signup'
  redirect(`/auth/signin${query}`)
}
