'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-scio-blue/20 to-scio-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-scio-orange/20 to-scio-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-scio-blue/10 to-scio-orange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-heading heading-primary text-3xl md:text-5xl text-white mb-6 text-balance">
            Looking to build skills that matter?
          </h2>
          <p className="font-body text-body text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who’ve experienced our guided programs—designed to equip you for success in careers, classrooms, and beyond.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-scio-blue to-scio-blue-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-user-graduate text-white text-2xl"></i>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-3">
                For Students
              </h3>
              <p className="font-body text-gray-300 text-sm mb-6">
                Get personalized career guidance and discover your true potential
              </p>
              <Button className="w-full bg-scio-blue hover:bg-scio-blue-dark text-white">
                Start Your Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-scio-orange to-scio-orange-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-school text-white text-2xl"></i>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-3">
                For Schools
              </h3>
              <p className="font-body text-gray-300 text-sm mb-6">
                Partner with us to provide comprehensive career guidance programs
              </p>
              <Button className="w-full bg-scio-orange hover:bg-scio-orange-dark text-white">
                Become a Partner
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-scio-blue to-scio-orange rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-chalkboard-teacher text-white text-2xl"></i>
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-3">
                For Counselors
              </h3>
              <p className="font-body text-gray-300 text-sm mb-6">
                Enhance your skills with our professional training programs
              </p>
              <Button className="w-full bg-gradient-to-r from-scio-blue to-scio-orange hover:opacity-90 text-white">
                Join Training
              </Button>
            </CardContent>
          </Card>
        </div> */}

        {/* Main CTA */}
        <div className="text-center">
          {/* <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-scio-orange to-scio-orange-light hover:from-scio-orange-dark hover:to-scio-orange text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25"
            >
              <i className="fas fa-rocket mr-3"></i>
              Get Started Today
            </Button>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 bg-white/10 backdrop-blur-sm"
              >
                <i className="fas fa-phone mr-3"></i>
                Contact Us
              </Button>
            </Link>
          </div> */}
              <Button
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 bg-white/10 backdrop-blur-sm"
              >
                <i className="fas fa-phone mr-3"></i>
                Contact Us
              </Button>
          <p className="font-body text-gray-400 mt-8 text-sm">
            Request a demo • Free consultation available • Trusted by 20000+ learners
          </p>
        </div>
      </div>

      {/* Floating accent elements */}
      <div className="absolute top-32 -left-6 opacity-20">
        <Card className="w-24 h-24 bg-gradient-to-br from-scio-blue/30 to-scio-orange/30 border-0 rotate-12">
          <CardContent className="p-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-scio-blue to-scio-orange rounded-full"></div>
          </CardContent>
        </Card>
      </div>
      
      <div className="absolute bottom-32 -right-6 opacity-20">
        <Card className="w-32 h-32 bg-gradient-to-br from-scio-orange/30 to-scio-blue/30 border-0 -rotate-12">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-scio-orange to-scio-blue rounded-full"></div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
