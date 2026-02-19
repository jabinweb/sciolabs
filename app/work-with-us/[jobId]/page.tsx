'use client'

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Send, 
  CheckCircle, 
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  Upload,
  FileText,
  X,
  Target,
  TrendingUp,
  Award
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface JobData {
  id: string
  title: string
  description: string
  qualifications: string[]
  location: string
  workHours: string
  payOut: string
  department: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  experience: string
  postedDate: string
  applicationDeadline?: string
}


export default function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Unwrap the params promise
  const { jobId } = use(params)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // First try to fetch from database
        const response = await fetch(`/api/jobs/${jobId}`)
        
        if (response.ok) {
          const data = await response.json()
          const job = data.job
          
          setJobData({
            id: job.id,
            title: job.title,
            description: job.description,
            qualifications: job.qualifications,
            location: job.location,
            workHours: job.workHours,
            payOut: job.payOut,
            department: job.department,
            type: job.type,
            experience: job.experience,
            postedDate: job.createdAt,
            applicationDeadline: job.applicationDeadline,
          })
        } 
      } catch (error) {
        console.error('Error fetching job:', error)
        notFound()
      }
    }

    fetchJob()
  }, [jobId])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // More comprehensive file type checking
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      const allowedExtensions = ['.pdf', '.doc', '.docx']
      const fileName = file.name.toLowerCase()
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
      const hasValidMimeType = allowedMimeTypes.includes(file.type)
      
      console.log('File validation:', {
        fileName: file.name,
        mimeType: file.type,
        hasValidExtension,
        hasValidMimeType
      })
      
      if (!hasValidMimeType && !hasValidExtension) {
        toast.error('Please upload a PDF or Word document (.pdf, .doc, .docx)')
        return
      }
      
      // Check file size (max 10MB for resumes)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      
      setResumeFile(file)
      toast.success('Resume selected successfully')
    }
  }

  const removeFile = () => {
    setResumeFile(null)
    setUploadProgress(0)
    // Reset file input
    const fileInput = document.getElementById('resume') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const form = e.currentTarget
    let resumeUrl = ''

    try {
      // Upload resume file if provided
      if (resumeFile) {
        setUploading(true)
        setUploadProgress(0)
        
        const formData = new FormData()
        formData.append('file', resumeFile)
        formData.append('type', 'resume')

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 15, 90))
        }, 300)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          resumeUrl = uploadData.url
          toast.success('Resume uploaded successfully')
        } else {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || 'Failed to upload resume')
        }
        setUploading(false)
      }

      const data = {
        firstName: (form.firstName as HTMLInputElement).value,
        lastName: (form.lastName as HTMLInputElement).value,
        email: (form.email as HTMLInputElement).value,
        phone: (form.phone as HTMLInputElement).value,
        position: jobData?.title || '',
        experience: (form.experience as HTMLSelectElement).value,
        resumeUrl: resumeUrl,
        resumeFileName: resumeFile?.name || '',
        jobId: jobId,
      }

      const payload = {
        formName: "job-application",
        data,
        email: data.email,
        phone: data.phone,
        source: `job-${jobId}`
      }

      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const result = await res.json()
      
      if (result.success) {
        setSuccess(true)
        form.reset()
        setResumeFile(null)
        setUploadProgress(0)
        toast.success('Application submitted successfully! We\'ll be in touch soon.')
      } else {
        const errorMsg = result.error || "Failed to submit application"
        setError(errorMsg)
        toast.error(`Failed to submit application: ${errorMsg}`)
      }
    } catch (err) {
      console.error('Application submission error:', err)
      setError(err instanceof Error ? err.message : "Failed to submit application")
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Education & Training':
        return <GraduationCap className="w-5 h-5" />
      case 'Technology & Development':
        return <Briefcase className="w-5 h-5" />
      case 'Content & Communication':
        return <Users className="w-5 h-5" />
      default:
        return <Briefcase className="w-5 h-5" />
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Education & Training':
        return 'bg-blue-500'
      case 'Technology & Development':
        return 'bg-green-500'
      case 'Content & Communication':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scio-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Minimal Dark Header */}
      <section className="bg-scio-blue pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            href="/work-with-us" 
            className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Careers
          </Link>
          
          <div className="flex items-start gap-6 mb-8">
            <div className={`w-16 h-16 ${getDepartmentColor(jobData.department)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl border border-white/20`}>
              <div className="text-white text-xl">{getDepartmentIcon(jobData.department)}</div>
            </div>
            <div className="flex-1">
              <Badge variant="outline" className="border-white/40 text-white bg-white/15 backdrop-blur-sm mb-3 font-medium">
                {jobData.department}
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {jobData.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-white/80">
                <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {jobData.location}
                </span>
                <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {jobData.type}
                </span>
                <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(jobData.postedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-scio-blue/10 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-scio-blue" />
                </div>
                About This Role
              </h2>
<div className="job-content prose prose-lg max-w-none text-gray-700">
  <style>{`
    .job-content ul {
      padding-left: 1.5rem !important;
    }

    .job-content ol {
      padding-left: 1.5rem !important;
    }

    .job-content li {
      position: relative !important;
      padding-left: 0.75rem !important;
    }

    /* Draw bullets manually (Tailwind v4 safe) */
    .job-content ul > li::before {
      content: "•";
      position: absolute;
      left: -1rem;
      top: 0.15em;
      font-size: 1.2em;
      color: #374151;
    }

    /* Numbers */
    .job-content ol {
      counter-reset: list;
    }

    .job-content ol > li {
      counter-increment: list;
    }

    .job-content ol > li::before {
      content: counter(list) ".";
      position: absolute;
      left: -1.5rem;
      font-weight: 600;
    }

    /* Fix Tiptap <p> inside li */
    .job-content li > p {
      display: inline !important;
      margin: 0 !important;
    }
  `}</style>

  <div dangerouslySetInnerHTML={{ __html: jobData.description }} />
</div>

            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                Requirements
              </h2>
              <ul className="space-y-4">
                {jobData.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{qualification}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors group">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Meaningful Compensation</h4>
                      <p className="text-gray-600 text-sm">A fair and transparent pay structure aligned with experience, responsibility, and contribution.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors group">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Thoughtful Flexibility</h4>
                      <p className="text-gray-600 text-sm">Clear expectations and timelines, with flexibility in how and where you work.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors group">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Intellectual Growth</h4>
                      <p className="text-gray-600 text-sm">Opportunities to learn, improve your skills, and take on more responsibility over time.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors group">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Purpose-Driven Work</h4>
                      <p className="text-gray-600 text-sm">The chance to work on projects that make a real difference in education.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-scio-blue/5 to-scio-orange/5 p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">Position Details</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-scio-blue">
                  <div className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-scio-blue" />
                    Location
                  </div>
                  <p className="text-gray-700 font-medium">{jobData.location}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    Schedule
                  </div>
                  <p className="text-gray-700 font-medium">{jobData.workHours}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                    Salary
                  </div>
                  <p className="text-gray-700 font-medium">{jobData.payOut}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    <GraduationCap className="w-4 h-4 mr-2 text-orange-600" />
                    Experience
                  </div>
                  <p className="text-gray-700 font-medium">{jobData.experience}</p>
                </div>
                
                {jobData.applicationDeadline && (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg">
                    <div className="flex items-center text-sm font-semibold text-yellow-800 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Application Deadline
                    </div>
                    <p className="text-yellow-700 font-bold">{formatDate(jobData.applicationDeadline)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Application Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-scio-blue/5 to-scio-orange/5 p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">Apply for This Position</h3>
                <p className="text-gray-600 text-sm mt-1">Submit your application below</p>
              </div>
              
              <div className="p-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-semibold text-gray-900">First Name *</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        placeholder="First name"
                        className="mt-2 h-11 border-2 border-gray-200 focus:border-scio-blue transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-semibold text-gray-900">Last Name *</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        className="mt-2 h-11 border-2 border-gray-200 focus:border-scio-blue transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-900">Email Address *</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="your.email@example.com"
                      className="mt-2 h-11 border-2 border-gray-200 focus:border-scio-blue transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel" 
                      placeholder="+91 9876543210"
                      className="mt-2 h-11 border-2 border-gray-200 focus:border-scio-blue transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience" className="text-sm font-semibold text-gray-900">Experience Level</Label>
                    <select 
                      id="experience"
                      name="experience"
                      className="w-full h-11 px-4 mt-2 border-2 border-gray-200 rounded-md text-sm bg-white focus:border-scio-blue transition-colors"
                    >
                      <option value="">Select your experience level</option>
                      <option value="0-1">0-1 years (Entry Level)</option>
                      <option value="2-3">2-3 years</option>
                      <option value="4-5">4-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years (Senior Level)</option>
                    </select>
                  </div>
                  
                  {/* Enhanced Resume Upload */}
                  <div>
                    <Label htmlFor="resume" className="text-sm font-semibold text-gray-900">Resume/CV *</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        required={!resumeFile}
                      />
                      
                      {!resumeFile ? (
                        <label
                          htmlFor="resume"
                          className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-scio-blue hover:bg-blue-50 transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-scio-blue" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-scio-blue">
                            Upload Your Resume
                          </span>
                          <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 10MB)</span>
                        </label>
                      ) : (
                        <div className="p-4 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-green-800 truncate max-w-32">
                                  {resumeFile.name}
                                </p>
                                <p className="text-xs text-green-600">
                                  {(resumeFile.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {uploading && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-green-700">Uploading...</span>
                                <span className="text-xs text-green-600">{uploadProgress}%</span>
                              </div>
                              <Progress value={uploadProgress} className="h-2" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-scio-blue hover:from-scio-blue-dark hover:to-scio-blue text-white h-12 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={loading || uploading}
                  >
                    {loading || uploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {uploading ? "Uploading Resume..." : "Submitting Application..."}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-3" />
                        Submit Application
                      </div>
                    )}
                  </Button>
                  
                  {success && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                      <div className="flex items-start text-green-800">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Application submitted successfully!</p>
                          <p className="text-sm text-green-700 mt-1">
                            Thank you for your interest! We&apos;ll review your application and contact you within 5-7 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg text-red-800">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Application submission failed</p>
                          <p className="text-sm mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
