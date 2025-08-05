'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  Clock, 
  CalendarDays,
  Briefcase
} from 'lucide-react'

interface Job {
  id: string
  title: string
  slug: string
  description: string
  qualifications: string[]
  location: string
  workHours: string
  payOut: string
  department: string
  type: string
  experience: string
  isActive: boolean
  applicationDeadline: string | null
  createdAt: string
  updatedAt: string
  creator: {
    id: string
    name: string | null
    email: string
  }
  categoryId?: string
}

interface JobCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  _count?: {
    jobs: number
  }
}

export default function JobsManagementPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [includeInactive, setIncludeInactive] = useState(false)
  
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/jobs?includeInactive=${includeInactive}`)
      
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      } else {
        toast.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [includeInactive])

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

  const handleDeleteJob = async (job: Job) => {
    if (!confirm(`Are you sure you want to delete "${job.title}"?`)) return

    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Job deleted successfully')
        fetchJobs()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Failed to delete job')
    }
  }

  const toggleJobStatus = async (job: Job) => {
    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !job.isActive })
      })

      if (response.ok) {
        toast.success(`Job ${!job.isActive ? 'activated' : 'deactivated'} successfully`)
        fetchJobs()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update job status')
      }
    } catch (error) {
      console.error('Error updating job status:', error)
      toast.error('Failed to update job status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Education & Training':
        return 'bg-blue-100 text-blue-800'
      case 'Technology & Development':
        return 'bg-green-100 text-green-800'
      case 'Content & Communication':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-scio-blue" />
            Jobs Management
          </h1>
          <p className="text-gray-600 mt-1">Create and manage job postings</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label>Show inactive jobs</Label>
          </div>
          
          <Button 
            className="bg-scio-blue hover:bg-scio-blue-dark"
            onClick={() => router.push('/admin/jobs/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Jobs ({jobs.length})</span>
            {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-scio-blue"></div>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-scio-blue"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No jobs found</p>
              <p className="text-gray-400">Create your first job posting to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className={`border transition-all duration-300 ${job.isActive ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 opacity-75'}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl font-semibold text-gray-800">
                            {job.title}
                          </h3>
                          <Badge className={getDepartmentColor(job.department)}>
                            {job.department}
                          </Badge>
                          <Badge variant={job.isActive ? "default" : "secondary"}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {job.experience}
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {formatDate(job.createdAt)}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {job.description}
                        </p>
                        
                        {job.applicationDeadline && (
                          <div className="mt-2 text-sm text-orange-600">
                            <CalendarDays className="w-4 h-4 inline mr-1" />
                            Deadline: {formatDate(job.applicationDeadline)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJobStatus(job)}
                        >
                          {job.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
    