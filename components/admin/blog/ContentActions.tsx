'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip'

interface ContentActionsProps {
  url?: string
  title?: string
  backLink?: string
  onBack?: () => void
  vertical?: boolean
}

export default function ContentActions({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Shared content',
  backLink,
  onBack,
  vertical = true
}: ContentActionsProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
    setShowShareMenu(false);
  }

  if (!vertical) {
    return (
      <div className="flex justify-between items-center mb-6">
        {(backLink || onBack) && (
          <Button variant="outline" size="sm" onClick={onBack || (() => {})}>
            <i className="fas fa-arrow-left mr-2"></i> Back
          </Button>
        )}
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-full ${liked ? 'text-red-500' : 'text-gray-400'}`}
            onClick={() => setLiked(!liked)}
          >
            <i className={`fas fa-heart ${liked ? 'text-red-500' : ''}`}></i>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 rounded-full ${bookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <i className={`fas fa-bookmark ${bookmarked ? 'text-yellow-500' : ''}`}></i>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-400"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <i className="fas fa-share-alt"></i>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-24 flex flex-col space-y-4 items-center">
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
          onClick={() => setLiked(!liked)}
        >
          <i className={`fas fa-heart ${liked ? 'text-red-500' : ''}`}></i>
        </Button>
        <span className="text-xs text-gray-500 mt-1">
          {liked ? 'Liked' : 'Like'}
        </span>
      </div>
      
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-gray-400 hover:text-purple-500"
          onClick={() => setShowShareMenu(!showShareMenu)}
        >
          <i className="fas fa-share-alt"></i>
        </Button>
        <span className="text-xs text-gray-500 mt-1 block text-center">Share</span>
        
        {showShareMenu && (
          <div className="absolute left-full ml-2 bg-white shadow-lg rounded-lg p-2 space-y-2 w-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-blue-600"
                  onClick={() => handleShare('facebook')}
                >
                  <i className="fab fa-facebook-f"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Share on Facebook</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-blue-400"
                  onClick={() => handleShare('twitter')}
                >
                  <i className="fab fa-twitter"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Share on Twitter</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-blue-700"
                  onClick={() => handleShare('linkedin')}
                >
                  <i className="fab fa-linkedin-in"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Share on LinkedIn</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${bookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
          onClick={() => setBookmarked(!bookmarked)}
        >
          <i className={`fas fa-bookmark ${bookmarked ? 'text-yellow-500' : ''}`}></i>
        </Button>
        <span className="text-xs text-gray-500 mt-1">
          {bookmarked ? 'Saved' : 'Save'}
        </span>
      </div>
    </div>
  )
}
        
