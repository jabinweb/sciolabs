'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import JobForm from '@/components/admin/JobForm'

interface Job {
  id: string
  title: string
  description: string
  qualifications: string[]
  location: string
  workHours: string
  payOut: string
  type: string
  experience: string
  applicationDeadline: string | null
  categoryId?: string
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

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [initialData, setInitialData] = useState<JobFormData | null>(null)

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/admin/jobs/${id}`)
        if (response.ok) {
          const data = await response.json()
          const job: Job = data.job
          
          setInitialData({
            title: job.title,
            description: job.description,
            qualifications: job.qualifications.length > 0 ? job.qualifications : [''],
            location: job.location,
            workHours: job.workHours,
            payOut: job.payOut,
            type: job.type as 'Full-time' | 'Part-time' | 'Contract',
            experience: job.experience,
            applicationDeadline: job.applicationDeadline 
              ? new Date(job.applicationDeadline).toISOString().split('T')[0] 
              : '',
            categoryId: job.categoryId || ''
          })
        } else {
          toast.error('Failed to load job')
          router.push('/admin/jobs')
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        toast.error('Failed to load job')
        router.push('/admin/jobs')
      } finally {
        setInitialLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id, router])

  const handleSubmit = async (formData: JobFormData) => {
    setLoading(true)
    
    try {
      const filteredQualifications = formData.qualifications.filter((q: string) => q.trim() !== '')
      
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          qualifications: filteredQualifications,
          categoryId: formData.categoryId || undefined,
          applicationDeadline: formData.applicationDeadline || undefined,
        })
      })

      if (response.ok) {
        toast.success('Job updated successfully')
        router.push('/admin/jobs')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update job')
      }
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('Failed to update job')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-scio-blue" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
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
            Edit Job
          </h1>
          <p className="text-gray-600">
            Update job posting details
          </p>
        </div>

        {/* Form */}
        {initialData && (
          <JobForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Update Job"
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
