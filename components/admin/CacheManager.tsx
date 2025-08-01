'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function CacheManager() {
  const [cacheSize, setCacheSize] = useState<number>(0)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    calculateCacheSize()
  }, [])

  const calculateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      setCacheSize(estimate.usage || 0)
    }
  }

  const clearAllCaches = async () => {
    setIsClearing(true)
    try {
      // Clear browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }

      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()

      // Update service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        await registration.update()
      }

      toast.success('All caches cleared successfully')
      setCacheSize(0)
      
      // Optional: reload page after cache clear
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error clearing caches:', error)
      toast.error('Failed to clear caches')
    } finally {
      setIsClearing(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Cache Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Cache Size:</span>
          <span className="font-medium">{formatBytes(cacheSize)}</span>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Info className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Clear cache if users report seeing outdated content
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={calculateCacheSize}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
          
          <Button
            variant="destructive"
            onClick={clearAllCaches}
            disabled={isClearing}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? 'Clearing...' : 'Clear All Cache'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
