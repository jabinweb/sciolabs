'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Download, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface ExtendedNavigator extends Navigator {
  standalone?: boolean
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Set mounted flag to prevent SSR issues
    setIsMounted(true)

    // Check if app is already installed or running in standalone mode
    const checkInstallState = () => {
      if (typeof window === 'undefined') return
      
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                               (window.navigator as ExtendedNavigator).standalone === true ||
                               document.referrer.includes('android-app://')
      
      setIsStandalone(isStandaloneMode)
      setIsInstalled(isStandaloneMode)
    }

    checkInstallState()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay if not installed and not dismissed in this session
      if (!isInstalled && typeof window !== 'undefined' && !sessionStorage.getItem('pwa-prompt-dismissed')) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      toast.success('App installed successfully!')
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
      }
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or when prompt is not available
      toast.info('To install: tap Share button and select "Add to Home Screen"')
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast.success('Installing app...')
      } else {
        toast.info('Installation cancelled')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Install prompt error:', error)
      toast.error('Failed to show install prompt')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Don't render anything until mounted (prevents SSR issues)
  if (!isMounted) {
    return null
  }

  // Don't show if already installed, dismissed this session, or no prompt available
  const isDismissed = typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed')
  
  if (isInstalled || 
      isStandalone || 
      isDismissed ||
      (!showPrompt && !deferredPrompt)) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-2">
      <Card className="bg-white border-2 border-scio-blue shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-scio-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-gray-900 mb-1">
                Install ScioLabs App
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Get quick access to our services and work offline with our app!
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
