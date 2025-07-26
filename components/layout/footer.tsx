import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-scio-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-scio-orange rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative w-40 h-12">
                <Image
                  src="/scioLabs_light.png"
                  alt="ScioLabs Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
            <p className="font-body text-gray-300 mb-6 max-w-md leading-relaxed">
              Empowering Lives Through Guidance, Education, and Excellence. 
              Transforming careers and lives through personalized guidance and innovative training programs.
            </p>
            
            {/* Contact Info */}
            {/* <div className="space-y-3">
              <div className="flex items-start space-x-3 text-gray-300">
                <i className="fas fa-map-marker-alt text-scio-orange mt-0.5 flex-shrink-0"></i>
                <span className="font-body text-sm">N-304, Ashiyana Sector – N, Lucknow – 226012, India</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <i className="fas fa-phone text-scio-orange flex-shrink-0"></i>
                <span className="font-body text-sm">+91 9495212484</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <i className="fas fa-envelope text-scio-orange flex-shrink-0"></i>
                <span className="font-body text-sm">info@sciolabs.in</span>
              </div>
            </div> */}

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="w-10 h-10 bg-scio-blue/20 hover:bg-scio-blue rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <i className="fab fa-facebook-f text-white"></i>
              </Link>
              <Link href="#" className="w-10 h-10 bg-scio-blue/20 hover:bg-scio-blue rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <i className="fab fa-twitter text-white"></i>
              </Link>
              <Link href="#" className="w-10 h-10 bg-scio-blue/20 hover:bg-scio-blue rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <i className="fab fa-linkedin-in text-white"></i>
              </Link>
              <Link href="#" className="w-10 h-10 bg-scio-blue/20 hover:bg-scio-blue rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <i className="fab fa-instagram text-white"></i>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6 text-scio-orange">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-orange rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-orange rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-orange rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-orange rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6 text-scio-blue">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="https://guidance.sciolabs.in/" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-blue rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  ScioGuidance
                </Link>
              </li>
              <li>
                <Link href="/thrive" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-blue rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  ScioThrive
                </Link>
              </li>
              <li>
                <Link href="https://care.sciolabs.in/" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-blue rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  ScioCare
                </Link>
              </li>
              <li>
                <Link href="/lingua" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-blue rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  ScioLingua
                </Link>
              </li>
              <li>
                <Link href="https://sprints.sciolabs.in/" className="font-body text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-scio-blue rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  ScioSprints
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-body text-gray-400 text-sm">
              © 2024 Scio Labs. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="font-body text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="font-body text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="font-body text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

