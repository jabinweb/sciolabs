'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tags,
  Briefcase,
  Loader2
} from 'lucide-react'

interface JobCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  createdAt: string
  updatedAt: string
  _count: {
    jobs: number
  }
}

const iconOptions = [
  { value: 'fas fa-graduation-cap', label: 'Graduation Cap', preview: '🎓' },
  { value: 'fas fa-code', label: 'Code', preview: '💻' },
  { value: 'fas fa-pen-fancy', label: 'Pen', preview: '✍️' },
  { value: 'fas fa-chart-line', label: 'Chart', preview: '📈' },
  { value: 'fas fa-cogs', label: 'Cogs', preview: '⚙️' },
  { value: 'fas fa-users', label: 'Users', preview: '👥' },
  { value: 'fas fa-briefcase', label: 'Briefcase', preview: '💼' },
  { value: 'fas fa-lightbulb', label: 'Lightbulb', preview: '💡' },
]

const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue', preview: '#3b82f6' },
  { value: 'bg-green-500', label: 'Green', preview: '#10b981' },
  { value: 'bg-orange-500', label: 'Orange', preview: '#f97316' },
  { value: 'bg-purple-500', label: 'Purple', preview: '#8b5cf6' },
  { value: 'bg-red-500', label: 'Red', preview: '#ef4444' },
  { value: 'bg-yellow-500', label: 'Yellow', preview: '#eab308' },
  { value: 'bg-pink-500', label: 'Pink', preview: '#ec4899' },
  { value: 'bg-gray-500', label: 'Gray', preview: '#6b7280' },
]

export default function JobCategoriesPage() {
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '',
  })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/job-categories')
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        toast.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '',
    })
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/job-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Category created successfully')
        setCreateDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/admin/job-categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Category updated successfully')
        setEditDialogOpen(false)
        setEditingCategory(null)
        resetForm()
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (category: JobCategory) => {
    if (category._count.jobs > 0) {
      toast.error(`Cannot delete category with ${category._count.jobs} jobs. Please reassign the jobs first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return

    try {
      const response = await fetch(`/api/admin/job-categories/${category.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const openEditDialog = (category: JobCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '',
    })
    setEditDialogOpen(true)
  }

  const CategoryForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void, submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Technology & Development"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this category"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.preview}</span>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: option.preview }}
                    ></div>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview */}
      {(formData.icon || formData.color) && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            {formData.icon && formData.color && (
              <div className={`w-10 h-10 ${formData.color} rounded-lg flex items-center justify-center`}>
                <i className={`${formData.icon} text-white`}></i>
              </div>
            )}
            <div>
              <div className="font-medium">{formData.name || 'Category Name'}</div>
              <div className="text-sm text-gray-500">{formData.description || 'Category description'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => {
          setCreateDialogOpen(false)
          setEditDialogOpen(false)
          resetForm()
        }}>
          Cancel
        </Button>
        <Button type="submit" className="bg-scio-blue hover:bg-scio-blue-dark">
          {submitLabel}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 flex items-center gap-3">
            <Tags className="w-8 h-8 text-scio-blue" />
            Job Categories
          </h1>
          <p className="text-gray-600 mt-2">Organize and manage job categories with custom icons and colors</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-scio-blue hover:bg-scio-blue-dark shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Job Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSubmit={handleCreateCategory} submitLabel="Create Category" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-scio-blue/5 to-scio-orange/5">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-800">All Categories ({categories.length})</span>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-scio-blue" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-scio-blue mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Tags className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">Create your first job category to get started organizing your job postings</p>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-scio-blue hover:bg-scio-blue-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Category
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="border border-gray-200 hover:border-scio-blue/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        {category.icon && category.color ? (
                          <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                            <i className={`${category.icon} text-white text-lg`}></i>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-lg font-semibold text-gray-800 group-hover:text-scio-blue transition-colors duration-300 truncate">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${category._count.jobs > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                            >
                              {category._count.jobs} job{category._count.jobs !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          className="h-8 w-8 p-0 hover:bg-scio-blue hover:text-white transition-colors duration-300"
                          title="Edit category"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-white hover:bg-red-500 transition-colors duration-300"
                          disabled={category._count.jobs > 0}
                          title={category._count.jobs > 0 ? "Cannot delete category with jobs" : "Delete category"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>Created {new Date(category.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                      {category._count.jobs > 0 && (
                        <span className="text-scio-blue font-medium">Active</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category: {editingCategory?.name}</DialogTitle>
          </DialogHeader>
          <CategoryForm onSubmit={handleEditCategory} submitLabel="Update Category" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
