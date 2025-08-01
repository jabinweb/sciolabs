'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, Save, ArrowLeft, Plus, Folder, Hash, Settings, FileText, Image as ImageIcon, Eye, Clock, Share, Trash2 } from 'lucide-react'
import { Editor } from './blog/editor'
import ImageUpload from './ImageUpload'

interface Category {
  id: string
  name: string
}

interface User {
  id: string
  name: string | null
  email: string
}

interface BlogPostFormProps {
  postId?: string
}

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const isEditing = !!postId

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    isPublished: false,
    imageUrl: '',
    tags: '',
    categoryId: '',
    authorId: '', // Add authorId to form data
  })

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/settings/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch users for author selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users?limit=100') // Get more users for selection
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to load users')
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  // If postId is provided, fetch the post data
  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      setIsLoading(true)
      try {
        console.log('Fetching post data for ID:', postId)
        const response = await fetch(`/api/admin/blog/${postId}`)
        console.log('Fetch response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Fetch error:', errorData)
          throw new Error(errorData.error || 'Failed to fetch post')
        }
        
        const data = await response.json()
        console.log('Fetched post data:', data)
        const post = data.post
        
        // Parse tags properly
        let parsedTags: string[] = []
        try {
          if (typeof post.tags === 'string') {
            parsedTags = JSON.parse(post.tags)
          } else if (Array.isArray(post.tags)) {
            parsedTags = post.tags
          }
        } catch (error) {
          console.error('Error parsing tags:', error)
          parsedTags = []
        }
        
        // Reset form with fetched data
        setFormData({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || '',
          isPublished: post.isPublished,
          imageUrl: post.imageUrl || '',
          tags: parsedTags.join(', '),
          categoryId: post.categoryId || '',
          authorId: post.authorId || '', // Set the author ID
        })
        
        console.log('Form data set:', {
          title: post.title,
          slug: post.slug,
          categoryId: post.categoryId,
          tags: parsedTags.join(', ')
        })
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const endpoint = isEditing 
        ? `/api/admin/blog/${postId}` 
        : '/api/admin/blog'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      // Process form data - ensure tags is a string (JSON)
      const processedData = {
        ...formData,
        categoryId: formData.categoryId === '' || formData.categoryId === 'none' ? null : formData.categoryId,
        excerpt: formData.excerpt || null,
        imageUrl: formData.imageUrl || null,
        authorId: formData.authorId || null, // Include authorId in submission
        // Convert tags to JSON string to match schema
        tags: JSON.stringify(formData.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || []),
      }
      
      console.log('Submitting data:', processedData)
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (jsonError) {
          console.error('Failed to parse error response as JSON:', jsonError)
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
        console.error('Server error response:', errorData)
        throw new Error(errorData.error || 'Something went wrong')
      }

      let responseData
      try {
        responseData = await response.json()
        console.log('Success response:', responseData)
      } catch (jsonError) {
        console.error('Failed to parse success response as JSON:', jsonError)
        // If JSON parsing fails but response was ok, treat as success
        console.log('Response was successful but not JSON')
      }

      toast.success(isEditing ? 'Post updated successfully' : 'Post created successfully')
      router.push('/admin/blog/posts')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save post')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') : prev.slug
    }))
  }

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsAddingCategory(true)
    try {
      const response = await fetch('/api/admin/settings/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setCategories([...categories, data.category])
        setFormData(prev => ({ ...prev, categoryId: data.category.id }))
        setNewCategoryName('')
        setShowCategoryDialog(false)
        toast.success('Category created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    } finally {
      setIsAddingCategory(false)
    }
  }

  // Handle preview
  const handlePreview = () => {
    if (!formData.slug) {
      toast.error('Please add a URL slug before previewing')
      return
    }
    
    // Open preview in new tab
    const previewUrl = `/blog/${formData.slug}${!formData.isPublished ? '?preview=true' : ''}`
    window.open(previewUrl, '_blank')
  }

  // Handle delete
  const handleDelete = async () => {
    if (!postId) return
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }

      toast.success('Post deleted successfully')
      router.push('/admin/blog/posts')
      router.refresh()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete post')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle publish/unpublish toggle
  const handlePublishToggle = async () => {
    if (!isEditing) return
    
    try {
      setIsLoading(true)
      const newPublishState = !formData.isPublished
      
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isPublished: newPublishState,
          categoryId: formData.categoryId === '' || formData.categoryId === 'none' ? null : formData.categoryId,
          excerpt: formData.excerpt || null,
          imageUrl: formData.imageUrl || null,
          tags: JSON.stringify(formData.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || []),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update post')
      }

      setFormData(prev => ({ ...prev, isPublished: newPublishState }))
      toast.success(newPublishState ? 'Post published successfully' : 'Post moved to draft')
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Simplified */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/blog')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isEditing ? 'Update your post content and settings' : 'Write and publish your new blog post'}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => router.push('/admin/blog/posts')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && !formData.title ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
              <p className="text-gray-600">Loading post...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter post title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="slug" className="text-sm font-medium text-gray-900">
                        URL Slug
                      </Label>
                      <Input 
                        id="slug"
                        placeholder="url-slug" 
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))
                        }
                        required
                        className="mt-1 font-mono text-sm"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This will be used in the post URL
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="mr-2 h-5 w-5" />
                      Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Editor
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder="Start writing your post..."
                    />
                  </CardContent>
                </Card>

                {/* Excerpt */}
                <Card>
                  <CardHeader>
                    <CardTitle>Excerpt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write a brief summary (optional)"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      This will appear in post previews and search results
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Enhanced Publish Settings with All Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Publish Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Status Display */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${formData.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <Label className="font-medium">
                            Status: {formData.isPublished ? 'Published' : 'Draft'}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {formData.isPublished ? 'Visible to readers' : 'Saved as draft'}
                          </p>
                        </div>
                      </div>
                      {isEditing && (
                        <Checkbox
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, isPublished: !!checked }))
                          }
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Preview Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handlePreview}
                        disabled={!formData.slug}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Post
                      </Button>

                      {isEditing ? (
                        <>
                          {/* Dynamic Publish/Draft Button */}
                          <Button
                            type="button"
                            onClick={handlePublishToggle}
                            disabled={isLoading}
                            className={`w-full ${
                              formData.isPublished 
                                ? 'bg-yellow-600 hover:bg-yellow-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            {isLoading 
                              ? (formData.isPublished ? 'Moving to Draft...' : 'Publishing...') 
                              : (formData.isPublished ? 'Move to Draft' : 'Publish Post')
                            }
                          </Button>

                          {/* Update Button */}
                          <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            {isLoading ? 'Updating...' : 'Update Post'}
                          </Button>

                          {/* Delete Button */}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Post
                          </Button>
                        </>
                      ) : (
                        /* Save as Draft and Publish buttons for new posts */
                        <>
                          <Button
                            type="button"
                            disabled={isLoading}
                            variant="outline"
                            className="w-full border-gray-300"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, isPublished: false }))
                              setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 0)
                            }}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            {isLoading ? 'Saving...' : 'Save as Draft'}
                          </Button>

                          <Button
                            type="button"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, isPublished: true }))
                              setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 0)
                            }}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            {isLoading ? 'Publishing...' : 'Publish Post'}
                          </Button>
                        </>
                      )}

                      {/* Additional Actions */}
                      <div className="pt-2 border-t">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              toast.info('Schedule functionality coming soon')
                            }}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Schedule
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              if (formData.slug) {
                                const postUrl = `${window.location.origin}/blog/${formData.slug}`
                                navigator.clipboard.writeText(postUrl)
                                toast.success('Post URL copied to clipboard')
                              } else {
                                toast.error('Please save the post first to get a shareable URL')
                              }
                            }}
                          >
                            <Share className="mr-1 h-3 w-3" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Author Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="fas fa-user mr-2 h-5 w-5"></i>
                      Author
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select 
                      value={formData.authorId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, authorId: value }))
                      }
                      disabled={isLoadingUsers}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select author"} />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <span>{user.name || 'Unnamed User'}</span>
                              <span className="text-xs text-gray-500">({user.email})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-sm text-gray-500">
                      Select the author for this blog post
                    </p>
                  </CardContent>
                </Card>

                {/* Enhanced Featured Image Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Featured Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                      onRemove={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      This image will be displayed as the main image for your blog post
                    </p>
                  </CardContent>
                </Card>

                {/* Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Folder className="mr-2 h-5 w-5" />
                        Category
                      </div>
                      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                              Create a new category for your blog posts.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="categoryName">Category Name</Label>
                              <Input
                                id="categoryName"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCategoryDialog(false)
                                setNewCategoryName('')
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddCategory}
                              disabled={isAddingCategory || !newCategoryName.trim()}
                            >
                              {isAddingCategory ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Create
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))
                      }
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Hash className="mr-2 h-5 w-5" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="technology, education, career"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Separate tags with commas
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}