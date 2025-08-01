import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
  const cyclingWords = [
    { text: 'Training', delay: '' },
    { text: 'Guidance', delay: 'delay-1' },
    { text: 'Innovation', delay: 'delay-2' },
    { text: 'Curriculums', delay: 'delay-3' }
  ];

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/6550419/6550419-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/90"></div>
      </div>
      
      {/* Navigation placeholder for spacing */}
      <div className="h-16 sm:h-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 sm:pb-32 flex items-center min-h-[80vh] sm:min-h-[85vh]">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="font-heading heading-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-balance leading-tight">
                <span className="block opacity-0 animate-slide-up">
                  Upward Equipping Through
                </span>
                <span className="block mt-2 sm:mt-4 relative h-12 sm:h-16 md:h-20 flex items-center justify-center">
                  {cyclingWords.map((word, index) => (
                    <span 
                      key={word.text}
                      className={`absolute ${index === 0 ? 'animate-text-cycle' : `opacity-0 animate-text-cycle-${word.delay}`}`}
                      style={{
                        background: 'linear-gradient(135deg, var(--scio-orange), var(--scio-orange-light))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {word.text}
                    </span>
                  ))}
                </span>
              </h1>
              
              <p className="font-body text-body text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-slide-up-delay-3 px-2">
                Move forward with confidence through focused training and purposeful guidance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 sm:pt-8 opacity-0 animate-slide-up-delay-3">
              <Link href="/#explore" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-scio-orange hover:bg-scio-orange-dark text-white px-6 sm:px-10 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg sm:shadow-2xl hover:shadow-orange-500/25 border-0"
                >
                  Explore ScioLabs
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-6 sm:px-10 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-lg transition-all duration-300 bg-white/10 backdrop-blur-sm"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements - adjusted for mobile */}
      <div className="absolute top-1/4 left-4 sm:left-10 opacity-20">
        <div 
          className="w-20 h-20 sm:w-32 sm:h-32 rounded-full blur-xl animate-pulse"
          style={{
            background: 'linear-gradient(to right, var(--scio-blue), var(--scio-blue-light))',
            opacity: 0.3
          }}
        ></div>
      </div>
      
      <div className="absolute bottom-1/4 right-4 sm:right-10 opacity-20">
        <div 
          className="w-24 h-24 sm:w-40 sm:h-40 rounded-full blur-xl animate-pulse delay-1000"
          style={{
            background: 'linear-gradient(to right, var(--scio-orange), var(--scio-orange-light))',
            opacity: 0.3
          }}
        ></div>
      </div>

      {/* Scroll indicator - hidden on very small screens */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-body">Scroll down</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </section>
  );
}