'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
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
import { Loader2, Save, ArrowLeft, Plus, Folder, Hash, Settings, FileText, Image as ImageIcon, Eye } from 'lucide-react'
import { Editor } from './blog/editor'

interface Category {
  id: string
  name: string
}

interface BlogPostFormProps {
  postId?: string
}

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
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

  // If postId is provided, fetch the post data
  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/blog/${postId}`)
        if (!response.ok) throw new Error('Failed to fetch post')
        
        const data = await response.json()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isEditing ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        {isLoading && !formData.title ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
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
                {/* Publish Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Publish Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Checkbox
                        id="published"
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, isPublished: !!checked }))
                        }
                      />
                      <div>
                        <Label htmlFor="published" className="font-medium cursor-pointer">
                          {formData.isPublished ? 'Published' : 'Draft'}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {formData.isPublished ? 'Visible to readers' : 'Save as draft'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Featured Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                    {formData.imageUrl && (
                      <div className="mt-3 relative h-32 rounded-lg overflow-hidden border">
                        <Image 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Post' : 'Publish Post'}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}