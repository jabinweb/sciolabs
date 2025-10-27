'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MessageSquare, Target, Rocket, TrendingUp, Award, Brain } from 'lucide-react';
import Link from 'next/link';

export default function FAMDQ2025Page() {
  // Debate keywords
  const debateKeywords = [
    'Pandemic Prevention',
    'Public Health',
    'Zoonotic Diseases',
    'Surveillance',
    'Global Health',
    'Resource Allocation'
  ];

  // Services tiles
  const services = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'ScioGuidance',
      description: 'Get personalised career guidance to navigate your career journey with clarity and confidence',
      color: 'from-blue-500 to-blue-600',
      link: 'https://guidance.sciolabs.in/'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'ScioSprints',
      description: 'Play curriculum-aligned games, compete with peers, and climb leaderboards — making revisions fun and rewarding',
      color: 'from-orange-500 to-orange-600',
      link: 'https://sprints.sciolabs.in/'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'ScioThrive',
      description: 'Experience customised training designed to help professionals, educators, and Gen Z learners excel in both work and life',
      color: 'from-purple-500 to-purple-600',
      link: '/thrive'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
         
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              FAMDQ <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">2025</span>
            </h1>
            <p className="font-body text-body text-lg md:text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed mb-4">
              The <strong>Farida Abraham Memorial Debate and Quiz (FAMDQ)</strong> is an annual gathering of some of the brightest young minds from schools across the country and beyond — a platform to exchange ideas, debate perspectives, and explore topics that shape the future.
            </p>
            <p className="font-body text-body text-lg md:text-xl text-gray-100 max-w-4xl mx-auto leading-relaxed">
              ScioLabs was honoured to host the <strong>FAMDQ Quiz 2025</strong> for the second consecutive year, bringing together curiosity, critical thinking, and collaboration in a celebration of learning.
            </p>
          </div>
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
                  Debate 2025
                </h2>
              </div>
              
              <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <p className="font-semibold text-gray-800 mb-2">Debate Topic:</p>
                <p className="text-gray-700 italic">&quot;This House Would Prioritize Zoonotic Disease Surveillance Over All Other Public Health Initiatives.&quot;</p>
              </div>

              <p className="font-body text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                This year&apos;s debate challenged participants to weigh pandemic prevention against immediate public health needs—exploring the balance between preparing for catastrophic threats and addressing ongoing health crises.
              </p>

              {/* Arguments Section */}
              <div className="space-y-6 mb-8">
                {/* For the Motion */}
                <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    For the Motion
                  </h3>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Prevention of Catastrophic Pandemics:</strong> Zoonotic diseases cause ~75% of emerging infectious diseases. COVID-19 alone killed 7M+ people and cost trillions—robust surveillance could detect threats before they become catastrophes.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Cost-Effectiveness:</strong> $3.4B annually in prevention could save $500B+ in outbreak costs (World Bank)—far cheaper to monitor and detect early than manage full-blown pandemics.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Existential Risk Management:</strong> Future pandemics could be deadlier with climate change and habitat encroachment accelerating spillover risk—an existential threat that dwarfs other concerns.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Multiplier Effect:</strong> Surveillance infrastructure strengthens all public health capacity—laboratory networks, epidemiological expertise, and rapid response benefit all initiatives.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Against the Motion */}
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Against the Motion
                  </h3>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Ongoing Crises Demand Attention:</strong> Chronic diseases kill 40M+ annually, malnutrition affects 800M—deprioritizing proven interventions abandons people suffering now for hypothetical threats.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Diminishing Returns:</strong> We can&apos;t predict pandemics despite surveillance—even sophisticated systems failed to prevent COVID-19, while diverted funds cause guaranteed preventable deaths today.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Inequitable Allocation:</strong> Wealthy nations&apos; pandemic fears would monopolize resources while low-income countries struggle with treatable conditions—reflects privilege over global health equity.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>Infrastructure Without Foundation:</strong> Surveillance requires functional healthcare systems—build comprehensive primary care that addresses immediate needs while creating pandemic preparedness.
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold min-w-fit">•</span>
                      <div>
                        <strong>False Binary Thinking:</strong> Public health needs integrated approaches—vaccination, primary care, and education all contribute to pandemic resilience while serving immediate needs.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-orange-500" />
                  Key Words
                </h3>
                <div className="flex flex-wrap gap-2">
                  {debateKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Related Resources:</p>
                <p className="text-sm text-gray-400 italic">Resources will be added here</p>
              </div> */}
            </CardContent>
          </Card>
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
                  Quiz 2025
                </h2>
              </div>
              
              <p className="font-body text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
                An exhilarating round of quizzing saw <strong>eight sharp school teams</strong> compete for the FAMDQ trophy, showcasing speed, accuracy, and insight.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded mb-6">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Play the Self-Paced Quiz!</p>
                    <p className="text-sm text-gray-600">
                      Test your knowledge and see how you score against the participating teams.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quiz Embed */}
              {/* <div className="w-full mb-6">
                <div className="relative w-full" style={{ paddingBottom: '56.25%', paddingTop: 0, height: 0 }}>
                  <iframe 
                    title="FAMDQ 2025 Quiz" 
                    frameBorder="0" 
                    width="1200" 
                    height="675" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src="https://view.genially.com/68ec8ab3d95d9983f9ee790d" 
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Discover ScioLabs Video Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Discover ScioLabs
          </h2>
          <p className="font-body text-gray-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto">
            Find out how ScioLabs can help you learn better, grow faster, and achieve <br />your academic and career goals.
          </p>
          
          <div className="relative w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
            <iframe 
              className="w-full h-full"
              src="https://videos.sproutvideo.com/embed/aa9bdab31811e9c620/4f8448e43829ea5f" 
              frameBorder="0" 
              allowFullScreen 
              referrerPolicy="no-referrer-when-downgrade" 
              title="ScioLabs Introduction Video"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading heading-primary text-2xl sm:text-3xl md:text-4xl text-scio-blue mb-3 sm:mb-4">
              Our Signature <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Programs</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover how ScioLabs can help you achieve your academic and career goals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-md sm:max-w-none mx-auto">
            {services.map((service, index) => (
              <Link href={service.link} key={index} target="_blank" rel="noopener noreferrer">
                <Card className="group bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full cursor-pointer">
                  <CardContent className="text-center sm:text-left">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-scio-blue transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="font-body text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-center sm:justify-start text-scio-blue font-semibold text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
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
      {/* <section className="py-12 md:py-20 bg-gradient-to-r from-scio-blue to-scio-blue-light relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4 sm:mb-6 drop-shadow-lg">
            Stay Connected with FAMDQ
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-6 sm:mb-8 drop-shadow-md px-4">
            Get updates about upcoming events, resources, and opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-white text-scio-blue hover:bg-gray-100 font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl w-full sm:w-auto"
            >
              Subscribe to Updates
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-scio-blue font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-xl w-full sm:w-auto"
            >
              View Past Events
            </Button>
          </div>
        </div>
      </section> */}
    </main>
  );
}
