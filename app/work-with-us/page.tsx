'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Award, ArrowRight, GraduationCap } from 'lucide-react';
import { useState, useEffect } from "react"
import Image from 'next/image';
import Link from 'next/link';

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
  applicationDeadline?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default function WorkWithUsPage() {
  const [dynamicJobs, setDynamicJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Fetching jobs from API...')
        const response = await fetch('/api/admin/jobs')
        console.log('Jobs fetch response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Jobs data received:', data)
          const activeJobs = data.jobs.filter((job: Job) => job.isActive)
          console.log('Active jobs:', activeJobs)
          setDynamicJobs(activeJobs)
        } else {
          const errorData = await response.json()
          console.error('Jobs fetch error:', errorData)
          setError('Failed to load jobs')
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setError('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Company benefits
  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Collaborative Culture',
      description: 'Work with passionate educators and innovators making a real impact'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Professional Growth',
      description: 'Continuous learning opportunities and career development support'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Schedule',
      description: 'Work-life balance with flexible hours and remote work options'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Competitive Benefits',
      description: 'Comprehensive compensation package and performance bonuses'
    }
  ];


  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              Join Our <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Mission</span>
            </h1>
            <p className="font-body text-body text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Be part of a team that&apos;s transforming education and empowering learners worldwide. 
              Discover exciting career opportunities at ScioLabs.
            </p>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading heading-primary text-3xl md:text-4xl text-scio-blue mb-6">
                Why ScioLabs?
              </h2>
              <p className="font-body text-lg text-gray-600 mb-8 leading-relaxed">
                At ScioLabs, we believe in the power of education to transform lives. Join our diverse team 
                of educators, technologists, and innovators who are passionate about creating meaningful 
                learning experiences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-scio-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white">{benefit.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-800 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-96 overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/4.jpg"
                  alt="Team collaboration at ScioLabs"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scio-blue/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Open Positions Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-3xl md:text-4xl text-scio-blue mb-4">
              Open Positions
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Explore current opportunities to join our team and make an impact in education
            </p>
          </div>

          <div className="space-y-16">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scio-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Loading positions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : dynamicJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dynamicJobs.map((job, index) => (
                  <Card key={job.id} className="group bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-heading text-lg font-semibold text-gray-800 group-hover:text-scio-blue transition-colors">
                          {job.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {job.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          {job.experience}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                      
                      <Link href={`/work-with-us/${job.slug}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full group-hover:bg-scio-blue group-hover:text-white transition-all duration-300"
                        >
                          View Details & Apply
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </div>
                <h3 className="font-heading text-xl text-gray-700 mb-2">No Open Positions</h3>
                <p className="font-body text-gray-600 text-lg mb-6">
                  We don&apos;t have any open positions at the moment, but we&apos;re always looking for talented people.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/contact">
                    <Button variant="outline" size="lg">
                      Get in Touch
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" asChild>
                    <a href="mailto:careers@sciolabs.in">
                      Send Your Resume
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="font-heading heading-secondary text-2xl text-gray-800 mb-4">
            Have Questions?
          </h3>
          <p className="font-body text-gray-600 mb-6">
            For more information about career opportunities at ScioLabs, feel free to reach out.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact HR Team
              </Button>
            </Link>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:careers@sciolabs.in">
                careers@sciolabs.in
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
