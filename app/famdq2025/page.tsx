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
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Card className="group bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                  FAMDQ &apos;25 Quiz
                </h2>
              </div>
              
              <p className="font-body text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Challenge yourself with our comprehensive quiz covering diverse topics. Test your knowledge, 
                compete with the best minds, and win exciting prizes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-start sm:items-center text-gray-600 text-sm sm:text-base">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Multiple rounds with increasing difficulty</span>
                </div>
                <div className="flex items-start sm:items-center text-gray-600 text-sm sm:text-base">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Topics from various academic domains</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white group-hover:shadow-lg transition-all px-8 sm:px-12 py-5 sm:py-6"
              >
                Register for Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Debate Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Card className="group bg-gradient-to-br from-slate-50 to-orange-50 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                  FAMDQ &apos;25 Debate
                </h2>
              </div>
              
              <p className="font-body text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Sharpen your critical thinking and public speaking skills. Engage in thought-provoking 
                debates on contemporary issues and showcase your argumentative prowess.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-start sm:items-center text-gray-600 text-sm sm:text-base">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Parliamentary debate format</span>
                </div>
                <div className="flex items-start sm:items-center text-gray-600 text-sm sm:text-base">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Current affairs and social topics</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white group-hover:shadow-lg transition-all px-8 sm:px-12 py-5 sm:py-6"
              >
                Register for Debate
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading heading-primary text-2xl sm:text-3xl md:text-4xl text-scio-blue mb-3 sm:mb-4">
              Explore Our <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover how ScioLabs can help you achieve your academic and career goals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Link href={service.link} key={index} target="_blank" rel="noopener noreferrer">
                <Card className="group bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full cursor-pointer">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-scio-blue transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="font-body text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center text-scio-blue font-semibold text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
                      Learn More
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="py-12 md:py-20 bg-gradient-to-r from-scio-blue to-scio-blue-light relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4 sm:mb-6 drop-shadow-lg">
            Ready to Join FAMDQ &apos;25?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-6 sm:mb-8 drop-shadow-md px-4">
            Don&apos;t miss this opportunity to showcase your talent and win amazing prizes
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-white text-scio-blue hover:bg-gray-100 font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl w-full sm:w-auto"
            >
              Register Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-scio-blue font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl w-full sm:w-auto"
            >
              View Schedule
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
