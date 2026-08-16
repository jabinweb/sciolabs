'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/layout/footer'

export default function MarketingFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/crm') || pathname.startsWith('/support')) {
    return null
  }
  return <Footer />
}
