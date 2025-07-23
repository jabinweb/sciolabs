'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const whatWeDoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Change header style when scrolled past a smaller threshold for better visibility
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Click outside handler for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (whatWeDoRef.current && !whatWeDoRef.current.contains(event.target as Node)) {
        setIsWhatWeDoOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const headerClass = isScrolled 
    ? "fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md border-b border-gray-200 z-50 shadow-lg" 
    : "fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm border-b border-white/10 z-50";

  const textClass = isScrolled ? "text-gray-800" : "text-white";
  const hoverTextClass = isScrolled ? "hover:text-scio-blue" : "hover:text-scio-orange";
  const underlineClass = isScrolled ? "bg-scio-blue" : "bg-scio-orange";
  const mobileButtonClass = isScrolled ? "text-gray-800 hover:text-scio-blue" : "text-white hover:text-scio-orange";
  const logoSrc = isScrolled ? "/sciolabs_logo.png" : "/scioLabs_light.png";

  return (
    <nav className={headerClass}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoSrc}
                alt="Scio Labs Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium relative group py-2`}
            >
              Home
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineClass} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
            <Link 
              href="/about" 
              className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium relative group py-2`}
            >
              About
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineClass} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
            
            {/* What We Do Dropdown */}
            <div className="relative group" ref={whatWeDoRef}>
              <button 
                className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium relative group py-2 flex items-center`}
                onClick={() => setIsWhatWeDoOpen(!isWhatWeDoOpen)}
              >
                What We Do
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${isWhatWeDoOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineClass} transition-all duration-300 group-hover:w-full`}></span>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 mt-2 transition-all duration-300 ${isWhatWeDoOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} z-50`}>
                <div className="p-4">
                  {/* Services Category */}
                  <div className="mb-4">
                    <h3 className="font-heading text-sm font-bold text-gray-500 mb-2 px-3 uppercase tracking-wider">Services</h3>
                    <Link 
                      href="/services/guidance" 
                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 hover:text-scio-blue transition-colors font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioGuidance
                    </Link>
                    <Link 
                      href="/services/thrive" 
                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 hover:text-scio-blue transition-colors font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioThrive
                    </Link>
                  </div>
                  
                  {/* Products Category */}
                  <div>
                    <h3 className="font-heading text-sm font-bold text-gray-500 mb-2 px-3 uppercase tracking-wider">Products</h3>
                    <Link 
                      href="/services/sprints" 
                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 hover:text-scio-blue transition-colors font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioSprints
                    </Link>
                    <Link 
                      href="/services/lingua" 
                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 hover:text-scio-blue transition-colors font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioLingua
                    </Link>
                    <Link 
                      href="/services/care" 
                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 hover:text-scio-blue transition-colors font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioCare
                    </Link>
                  </div>

                  {/* View All Link */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Link 
                      href="/services" 
                      className="block px-3 py-2 rounded-lg bg-gray-50 text-scio-blue font-medium text-center transition-colors hover:bg-gray-100 font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to desktop menu */}
            <Link 
              href="/blog" 
              className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium relative group py-2`}
            >
              Blog
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineClass} transition-all duration-300 group-hover:w-full`}></span>
            </Link>

            <Link 
              href="/contact" 
              className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium relative group py-2`}
            >
              Contact
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineClass} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${mobileButtonClass} transition-colors duration-300 p-2`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-0 left-0 w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2.5' : ''}`}></span>
              <span className={`absolute top-2.5 left-0 w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute top-5 left-0 w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen py-6' : 'max-h-0'}`}>
          <div className={`border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'} pt-6`}>
            <div className="flex flex-col space-y-6">
              <Link 
                href="/" 
                className={`font-body ${textClass} ${hoverTextClass} transition-colors font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`font-body ${textClass} ${hoverTextClass} transition-colors font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile What We Do submenu */}
              <div className="space-y-3">
                <h3 className={`font-body ${textClass} font-medium text-lg`}>What We Do</h3>
                
                <div className="ml-4 space-y-4">
                  {/* Services Category */}
                    <div className="space-y-2">
                    <h4 className="font-heading text-sm font-bold text-gray-400 uppercase tracking-wider">Services</h4>
                    <Link 
                      href="/services/guidance" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioGuidance
                    </Link>
                    <Link 
                      href="/services/thrive" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioThrive
                    </Link>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-heading text-sm font-bold text-gray-400 uppercase tracking-wider">Products</h4>
                    <Link 
                      href="/services/sprints" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioSprints
                    </Link>
                    <Link 
                      href="/services/lingua" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioLingua
                    </Link>
                    <Link 
                      href="/services/care" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioCare
                    </Link>
                  </div>
                  
                  <Link 
                    href="/services" 
                    className={`block font-body ${textClass} font-medium ${hoverTextClass} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View All Services
                  </Link>
                </div>
              </div>
              
              <Link 
                href="/contact" 
                className={`font-body ${textClass} ${hoverTextClass} transition-colors font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Blog Link */}
              <Link 
                href="/blog" 
                className={`font-body ${textClass} ${hoverTextClass} transition-colors font-medium text-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}