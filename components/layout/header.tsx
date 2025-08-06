'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const whatWeDoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set mounted flag and check initial scroll position
    setIsMounted(true);
    // Use a smaller threshold and check immediately
    setIsScrolled(window.scrollY > 50);

    const handleScroll = () => {
      // Use a smaller threshold for more responsive background changes
      setIsScrolled(window.scrollY > 50);
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md border-b border-gray-200 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/sciolabs_logo.png"
                  alt="Scio Labs Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Improved header class with better background transitions and mobile menu handling
  const headerClass = (isScrolled || isMenuOpen)
    ? "fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md border-b border-gray-200 z-50 shadow-lg" 
    : "fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm border-b border-white/10 z-50";

  const textClass = (isScrolled || isMenuOpen) ? "text-gray-800" : "text-white";
  const hoverTextClass = (isScrolled || isMenuOpen) ? "hover:text-scio-blue" : "hover:text-scio-orange";
  const underlineClass = (isScrolled || isMenuOpen) ? "bg-scio-blue" : "bg-scio-orange";
  const mobileButtonClass = (isScrolled || isMenuOpen) ? "text-gray-800 hover:text-scio-blue" : "text-white hover:text-scio-orange";
  const logoSrc = (isScrolled || isMenuOpen) ? "/sciolabs_logo.png" : "/scioLabs_light.png";

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={headerClass}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-all duration-300 group-hover:scale-105">
              <Image
                src={logoSrc}
                alt="Scio Labs Logo"
                fill
                className="object-contain transition-opacity duration-300"
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

            {/* What We Do Dropdown - moved after About */}
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
              <div className={`absolute top-full left-0 w-64 bg-white/98 backdrop-blur-md rounded-lg shadow-xl border border-gray-100/80 mt-2 transition-all duration-300 ${isWhatWeDoOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'} z-50`}>
                <div className="p-4">
                  {/* Services Category */}
                  <div className="mb-4">
                    <h3 className="font-heading text-sm font-bold text-gray-500 mb-2 px-3 uppercase tracking-wider">Services</h3>
                    <Link 
                      href="https://guidance.sciolabs.in/" 
                      className="block px-3 py-2 rounded-lg hover:bg-scio-blue/5 text-gray-800 hover:text-scio-blue transition-all duration-200 font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioGuidance
                    </Link>
                    <Link 
                      href="/thrive" 
                      className="block px-3 py-2 rounded-lg hover:bg-scio-blue/5 text-gray-800 hover:text-scio-blue transition-all duration-200 font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioThrive
                    </Link>
                  </div>
                  
                  {/* Products Category */}
                  <div>
                    <h3 className="font-heading text-sm font-bold text-gray-500 mb-2 px-3 uppercase tracking-wider">Products</h3>
                    <Link 
                      href="https://sprints.sciolabs.in/" 
                      className="block px-3 py-2 rounded-lg hover:bg-scio-blue/5 text-gray-800 hover:text-scio-blue transition-all duration-200 font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioSprints
                    </Link>
                    <Link 
                      href="/lingua" 
                      className="block px-3 py-2 rounded-lg hover:bg-scio-blue/5 text-gray-800 hover:text-scio-blue transition-all duration-200 font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioLingua
                    </Link>
                    <Link 
                      href="https://care.sciolabs.in/" 
                      className="block px-3 py-2 rounded-lg hover:bg-scio-blue/5 text-gray-800 hover:text-scio-blue transition-all duration-200 font-body"
                      onClick={() => setIsWhatWeDoOpen(false)}
                    >
                      ScioCare
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
            className={`lg:hidden ${mobileButtonClass} transition-all duration-300 p-2 rounded-lg hover:bg-black/5`}
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
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`border-t ${(isScrolled || isMenuOpen) ? 'border-gray-200/50' : 'border-white/20'} pt-6 pb-6`}>
            <div className="flex flex-col space-y-6">
              <Link 
                href="/"
                className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium text-lg hover:translate-x-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link 
                href="/about"
                className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium text-lg hover:translate-x-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile What We Do submenu - moved after About */}
              <div className="space-y-3">
                <h3 className={`font-body ${textClass} font-medium text-lg`}>What We Do</h3>
                
                <div className="ml-4 space-y-4">
                  {/* Services Category */}
                  <div className="space-y-2">
                    <h4 className="font-heading text-sm font-bold text-gray-400 uppercase tracking-wider">Services</h4>
                    <Link 
                      href="https://guidance.sciolabs.in" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-all duration-300 hover:translate-x-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioGuidance
                    </Link>
                    <Link 
                      href="/thrive" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-all duration-300 hover:translate-x-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioThrive
                    </Link>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-heading text-sm font-bold text-gray-400 uppercase tracking-wider">Products</h4>
                    <Link 
                      href="https://sprints.sciolabs.in" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-all duration-300 hover:translate-x-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioSprints
                    </Link>
                    <Link 
                      href="/lingua" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-all duration-300 hover:translate-x-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioLingua
                    </Link>
                    <Link 
                      href="https://care.sciolabs.in" 
                      className={`block font-body ${textClass} ${hoverTextClass} transition-all duration-300 hover:translate-x-2`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ScioCare
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/blog"
                className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium text-lg hover:translate-x-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>

              <Link 
                href="/contact"
                className={`font-body ${textClass} ${hoverTextClass} transition-all duration-300 font-medium text-lg hover:translate-x-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}