'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import JobForm from '@/components/admin/JobForm'

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

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: JobFormData) => {
    setLoading(true)
    
    try {
      const filteredQualifications = formData.qualifications.filter((q: string) => q.trim() !== '')
      
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          qualifications: filteredQualifications,
          categoryId: formData.categoryId || undefined,
          applicationDeadline: formData.applicationDeadline || undefined,
        })
      })

      if (response.ok) {
        toast.success('Job created successfully')
        router.push('/admin/jobs')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create job')
      }
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/jobs')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
          
          <h1 className="font-heading text-3xl text-gray-800 mb-2">
            Create New Job
          </h1>
          <p className="text-gray-600">
            Add a new job posting to your careers page
          </p>
        </div>

        {/* Form */}
        <JobForm
          onSubmit={handleSubmit}
          submitLabel="Create Job"
          loading={loading}
        />
      </div>
    </div>
  )
}
