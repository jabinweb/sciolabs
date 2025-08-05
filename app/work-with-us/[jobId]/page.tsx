'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
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

// Sample job data - in a real app, this would come from an API or database
const jobsData: Record<string, JobData> = {
  'curriculum-developer': {
    id: 'curriculum-developer',
    title: 'Curriculum Developer',
    description: 'We are looking for a creative and experienced Curriculum Developer to join our education team. You will be responsible for designing and developing innovative educational content and curricula for our various programs. The ideal candidate should have a strong background in educational design, understand modern pedagogy, and be passionate about creating engaging learning experiences.',
    qualifications: [
      'Bachelor\'s degree in Education, Instructional Design, or related field',
      'Master\'s degree preferred',
      '2-4 years of experience in curriculum development',
      'Strong understanding of learning theories and educational best practices',
      'Experience with digital learning platforms and ed-tech tools',
      'Excellent written and verbal communication skills',
      'Proficiency in design software (Adobe Creative Suite, Canva, etc.)',
      'Experience with Learning Management Systems (LMS)',
      'Knowledge of CBSE curriculum is a plus'
    ],
    location: 'Lucknow / Remote',
    workHours: 'Full-time, Monday to Friday, 9:00 AM - 6:00 PM',
    payOut: '₹4,50,000 - ₹7,00,000 per annum (negotiable based on experience)',
    department: 'Education & Training',
    type: 'Full-time',
    experience: '2-4 years',
    postedDate: '2024-01-15',
    applicationDeadline: '2024-02-15'
  },
  'full-stack-developer': {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    description: 'Join our technology team as a Full Stack Developer to build and maintain our educational platforms and web applications. You will work on cutting-edge educational technology solutions, collaborating with designers and product managers to create seamless user experiences for learners and educators.',
    qualifications: [
      'Bachelor\'s degree in Computer Science, Software Engineering, or related field',
      '2-5 years of full-stack development experience',
      'Proficiency in React.js, Next.js, Node.js, and TypeScript',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Knowledge of cloud platforms (AWS, Vercel, etc.)',
      'Understanding of RESTful APIs and GraphQL',
      'Experience with version control (Git)',
      'Familiarity with educational technology is a plus',
      'Strong problem-solving and debugging skills'
    ],
    location: 'Lucknow / Remote',
    workHours: 'Full-time, Monday to Friday, 10:00 AM - 7:00 PM',
    payOut: '₹6,00,000 - ₹12,00,000 per annum (based on experience)',
    department: 'Technology & Development',
    type: 'Full-time',
    experience: '2-5 years',
    postedDate: '2024-01-10',
    applicationDeadline: '2024-02-10'
  },
  'content-writer': {
    id: 'content-writer',
    title: 'Content Writer',
    description: 'We are seeking a talented Content Writer to create compelling educational content for our programs and marketing materials. You will be responsible for writing engaging blog posts, educational materials, course content, and marketing copy that resonates with our diverse audience of learners and educators.',
    qualifications: [
      'Bachelor\'s degree in English, Journalism, Communications, or related field',
      '1-3 years of content writing experience',
      'Excellent writing, editing, and proofreading skills',
      'Experience with SEO content writing',
      'Familiarity with content management systems',
      'Understanding of educational content and learning objectives',
      'Ability to write for different audiences and platforms',
      'Research skills and attention to detail',
      'Experience with social media content creation is a plus'
    ],
    location: 'Remote',
    workHours: 'Part-time, Flexible hours (20-25 hours per week)',
    payOut: '₹25,000 - ₹40,000 per month (based on hours and experience)',
    department: 'Content & Communication',
    type: 'Part-time',
    experience: '1-3 years',
    postedDate: '2024-01-20',
    applicationDeadline: '2024-02-20'
  }
}

export default function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [jobData, setJobData] = useState<JobData | null>(null)
  
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
        } else {
          // Fallback to static data
          const job = jobsData[jobId]
          if (!job) {
            notFound()
          }
          setJobData(job)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
        // Fallback to static data
        const job = jobsData[jobId]
        if (!job) {
          notFound()
        }
        setJobData(job)
      }
    }

    fetchJob()
  }, [jobId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const form = e.currentTarget
    const data = {
      firstName: (form.firstName as HTMLInputElement).value,
      lastName: (form.lastName as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      position: jobData?.title || '',
      experience: (form.experience as HTMLSelectElement).value,
      portfolio: (form.portfolio as HTMLInputElement).value,
      coverLetter: (form.coverLetter as HTMLTextAreaElement).value,
      jobId: jobId,
    }

    const payload = {
      formName: "job-application",
      data,
      email: data.email,
      phone: data.phone,
      source: `job-${jobId}`
    }

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const result = await res.json()
      
      if (result.success) {
        setSuccess(true)
        form.reset()
        toast.success('Thank you! Your application has been submitted successfully.')
      } else {
        const errorMsg = result.error || "Failed to submit application"
        setError(errorMsg)
        toast.error(`Failed to submit application: ${errorMsg}`)
      }
    } catch {
      setError("Failed to submit application")
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link 
            href="/work-with-us" 
            className="inline-flex items-center text-white hover:text-yellow-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
          
          <div className="text-white">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 ${getDepartmentColor(jobData.department)} rounded-xl flex items-center justify-center mr-4`}>
                <div className="text-white">{getDepartmentIcon(jobData.department)}</div>
              </div>
              <div>
                <Badge variant="outline" className="border-white text-white mb-2">
                  {jobData.department}
                </Badge>
                <h1 className="font-heading heading-primary text-4xl md:text-5xl">
                  {jobData.title}
                </h1>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-200 mt-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {jobData.location}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {jobData.type}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Posted {formatDate(jobData.postedDate)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-scio-blue">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-scio-blue">Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {jobData.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{qualification}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How to Apply */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-scio-blue">How to Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Interested candidates can apply by filling out the application form below. 
                  Please include a detailed cover letter explaining why you&apos;re interested in this position 
                  and what you can bring to our team. Applications will be reviewed on a rolling basis.
                </p>
                {jobData.applicationDeadline && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">
                      Application Deadline: {formatDate(jobData.applicationDeadline)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-scio-blue">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-scio-blue" />
                    Location
                  </h4>
                  <p className="text-gray-600">{jobData.location}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-scio-blue" />
                    Work Hours
                  </h4>
                  <p className="text-gray-600">{jobData.workHours}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-scio-blue" />
                    Compensation
                  </h4>
                  <p className="text-gray-600">{jobData.payOut}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-scio-blue" />
                    Experience Required
                  </h4>
                  <p className="text-gray-600">{jobData.experience}</p>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-scio-blue">Apply for This Position</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        type="text" 
                        placeholder="Your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        type="text" 
                        placeholder="Your last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel" 
                      placeholder="+91 9876543210"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <select 
                      id="experience"
                      name="experience"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scio-blue focus:border-transparent"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-3">2-3 years</option>
                      <option value="4-5">4-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Resume Link</Label>
                    <Input 
                      id="portfolio"
                      name="portfolio"
                      type="url" 
                      placeholder="https://your-portfolio.com or LinkedIn profile"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter *</Label>
                    <Textarea 
                      id="coverLetter"
                      name="coverLetter"
                      rows={6} 
                      placeholder="Tell us why you're interested in this position and what you can bring to our team..."
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-scio-blue hover:bg-scio-blue-dark text-white"
                    disabled={loading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                  
                  {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Thank you! Your application has been submitted successfully.
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      {error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-scio-blue">About ScioLabs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-32 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/4.jpg"
                    alt="ScioLabs team"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Join a team that&apos;s passionate about transforming education and empowering learners worldwide. 
                  We offer a collaborative work environment, opportunities for growth, and the chance to make a 
                  real impact in the education sector.
                </p>
                <Link href="/about" className="inline-flex items-center text-scio-blue hover:text-scio-blue-dark mt-3 text-sm">
                  Learn more about us
                  <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
