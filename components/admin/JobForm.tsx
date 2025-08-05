'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Plus, 
  Trash2, 
  Save,
  Loader2
} from 'lucide-react'

interface JobCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
}

interface JobFormData {
  title: string
  description: string
  qualifications: string[]
  location: string
  workHours: string
  payOut: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  experience: string
  applicationDeadline: string
  categoryId: string
}

interface JobFormProps {
  initialData?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => Promise<void>
  submitLabel: string
  loading: boolean
}

export default function JobForm({ initialData, onSubmit, submitLabel, loading }: JobFormProps) {
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
  
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    qualifications: initialData?.qualifications || [''],
    location: initialData?.location || '',
    workHours: initialData?.workHours || '',
    payOut: initialData?.payOut || '',
    type: initialData?.type || 'Full-time',
    experience: initialData?.experience || '',
    applicationDeadline: initialData?.applicationDeadline || '',
    categoryId: initialData?.categoryId || ''
  })

  // Fetch job categories
  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const response = await fetch('/api/admin/job-categories')
        if (response.ok) {
          const data = await response.json()
          setJobCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching job categories:', error)
        toast.error('Failed to load job categories')
      }
    }

    fetchJobCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, '']
    }))
  }

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }))
  }

  const updateQualification = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((q, i) => i === index ? value : q)
    }))
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Full Stack Developer"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">Department/Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department/category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon && (
                          <i className={`${category.icon} text-sm`}></i>
                        )}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select value={formData.type} onValueChange={(value: 'Full-time' | 'Part-time' | 'Contract') => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Lucknow / Remote"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Required *</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g. 2-4 years"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="workHours">Work Hours *</Label>
              <Input
                id="workHours"
                value={formData.workHours}
                onChange={(e) => setFormData(prev => ({ ...prev, workHours: e.target.value }))}
                placeholder="e.g. Monday to Friday, 9:00 AM - 6:00 PM"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payOut">Compensation *</Label>
              <Input
                id="payOut"
                value={formData.payOut}
                onChange={(e) => setFormData(prev => ({ ...prev, payOut: e.target.value }))}
                placeholder="e.g. ₹4,50,000 - ₹7,00,000 per annum"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline (Optional)</Label>
            <Input
              id="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the role, responsibilities, and requirements..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Qualifications *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Qualification
              </Button>
            </div>
            
            {formData.qualifications.map((qualification, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={qualification}
                  onChange={(e) => updateQualification(index, e.target.value)}
                  placeholder="e.g. Bachelor's degree in Computer Science"
                  className="flex-1"
                />
                {formData.qualifications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQualification(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button 
              type="submit" 
              className="bg-scio-blue hover:bg-scio-blue-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {submitLabel}...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
