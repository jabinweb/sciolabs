import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { servicesData } from '@/lib/services-data';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.id,
  }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 pt-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-20 left-20 w-64 h-64 bg-${service.primaryColor} rounded-full blur-3xl animate-pulse`}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-scio-orange rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
              <div className={`inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-${service.primaryColor} to-${service.primaryColor}-light rounded-full text-white`}>
                <i className={`${service.features[0].icon} text-xl`}></i>
                <span className="font-heading heading-secondary text-lg font-semibold">{service.title}</span>
              </div>
              
              <h1 className="font-heading heading-primary text-5xl md:text-7xl text-white mb-6">
                {service.title}
              </h1>
              
              <p className="font-body text-body text-xl md:text-2xl text-gray-300 leading-relaxed">
                {service.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={service.getStartedLink} target='_blank'>
                  <Button size="lg" className={`bg-${service.primaryColor} hover:opacity-90 text-white px-8 py-4 rounded-xl font-heading font-semibold text-lg`}>
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className={`border-2 border-white text-${service.primaryColor} px-8 py-4 rounded-xl font-heading font-semibold text-lg`}>
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-96 lg:h-[350px] overflow-hidden rounded-3xl shadow-2xl group">
                <Image
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-${service.primaryColor}/20 to-transparent`}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
                  About {service.title}
                </h2>
                <p className="font-body text-body text-lg text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Features Grid */}
              <div>
                <h3 className="font-heading heading-secondary text-2xl text-gray-800 mb-8">
                  Our Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.features.map((feature) => (
                    <Card key={feature.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r from-${service.primaryColor} to-${service.primaryColor}-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <i className={`${feature.icon} text-white text-lg`}></i>
                          </div>
                          <div>
                            <h4 className="font-heading text-lg font-semibold text-gray-800 mb-2">
                              {feature.title}
                            </h4>
                            <p className="font-body text-gray-600 text-sm">
                              {feature.description}
                            </p>
                            {feature.link && (
                              <Link href={feature.link} className={`inline-flex items-center mt-3 text-${service.primaryColor} hover:underline text-sm font-medium`}>
                                Learn More <i className="fas fa-arrow-right ml-1 text-xs"></i>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-heading heading-secondary text-2xl text-gray-800 mb-8">
                  Key Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-6 h-6 bg-${service.primaryColor} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                      <p className="font-body text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Info */}
              <Card className={`bg-gradient-to-br from-${service.primaryColor}/5 to-${service.primaryColor}/10 border-0`}>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-gray-800 mb-4">
                    Quick Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-gray-700 mb-2">Target Audience</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.targetAudience.map((audience, index) => (
                          <span key={index} className={`px-3 py-1 bg-${service.primaryColor}/20 text-${service.primaryColor} rounded-full text-xs font-medium`}>
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-gray-700 mb-2">Key Features</h4>
                      <ul className="space-y-2">
                        {service.detailedFeatures.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 bg-${service.primaryColor} rounded-full`}></div>
                            <span className="font-body text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Services */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-gray-800 mb-4">
                    Other Services
                  </h3>
                  <div className="space-y-3">
                    {servicesData.filter(s => s.id !== service.id).slice(0, 3).map((relatedService) => (
                      <Link key={relatedService.id} href={`/services/${relatedService.id}`} className="block p-1 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          {/* <div className={`w-8 h-8 bg-gradient-to-r from-${relatedService.primaryColor} to-${relatedService.primaryColor}-light rounded-lg flex items-center justify-center`}>
                            <i className={`${relatedService.features[0].icon} text-white text-sm`}></i>
                          </div> */}
                          <div>
                            <h4 className={`font-heading text-sm font-semibold text-${relatedService.primaryColor}`}>
                              {relatedService.title}
                            </h4>
                            <p className="font-body text-xs text-gray-600">
                              {relatedService.subtitle.slice(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
