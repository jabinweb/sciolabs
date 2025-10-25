'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Target, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function FAMDQ2025Page() {
  // Services tiles
  const services = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'ScioGuidance',
      description: 'Expert guidance and mentorship for your academic and career journey',
      color: 'from-blue-500 to-blue-600',
      link: 'https://guidance.sciolabs.in/'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'ScioSprints',
      description: 'Intensive skill-building workshops and bootcamps',
      color: 'from-orange-500 to-orange-600',
      link: 'https://sprints.sciolabs.in/'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'ScioThrive',
      description: 'Comprehensive programs for long-term growth and success',
      color: 'from-purple-500 to-purple-600',
      link: '/thrive'
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
              FAMDQ <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">&apos;25</span>
            </h1>
            <p className="font-body text-body text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Test your knowledge, challenge your peers, and showcase your skills in the most anticipated quiz and debate competition of the year.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-6">
          <Card className="group bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardContent className="p-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800">
                  FAMDQ &apos;25 Quiz
                </h2>
              </div>
              
              <p className="font-body text-gray-600 text-lg mb-8 leading-relaxed">
                Challenge yourself with our comprehensive quiz covering diverse topics. Test your knowledge, 
                compete with the best minds, and win exciting prizes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-gray-600">
                  <Lightbulb className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" />
                  <span>Multiple rounds with increasing difficulty</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" />
                  <span>Topics from various academic domains</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white group-hover:shadow-lg transition-all px-12"
              >
                Register for Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Debate Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Card className="group bg-gradient-to-br from-slate-50 to-orange-50 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            <CardContent className="p-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800">
                  FAMDQ &apos;25 Debate
                </h2>
              </div>
              
              <p className="font-body text-gray-600 text-lg mb-8 leading-relaxed">
                Sharpen your critical thinking and public speaking skills. Engage in thought-provoking 
                debates on contemporary issues and showcase your argumentative prowess.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-gray-600">
                  <Lightbulb className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0" />
                  <span>Parliamentary debate format</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0" />
                  <span>Current affairs and social topics</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white group-hover:shadow-lg transition-all px-12"
              >
                Register for Debate
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading heading-primary text-3xl md:text-4xl text-scio-blue mb-4">
              Explore Our <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how ScioLabs can help you achieve your academic and career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link href={service.link} key={index} target="_blank" rel="noopener noreferrer">
                <Card className="group bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full cursor-pointer">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-gray-800 mb-3 group-hover:text-scio-blue transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="font-body text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center text-scio-blue font-semibold text-sm group-hover:translate-x-2 transition-transform">
                      Learn More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-scio-blue to-scio-blue-light relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading text-3xl md:text-4xl text-white font-bold mb-6 drop-shadow-lg">
            Ready to Join FAMDQ &apos;25?
          </h2>
          <p className="text-xl text-white font-medium mb-8 drop-shadow-md">
            Don&apos;t miss this opportunity to showcase your talent and win amazing prizes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-scio-blue hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl"
            >
              Register Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-scio-blue font-semibold px-8 py-6 text-lg shadow-xl"
            >
              View Schedule
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
