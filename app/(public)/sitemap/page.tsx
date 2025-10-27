import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function SitemapPage() {
  const siteStructure = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
        { name: "Services", url: "/services" },
        { name: "Contact", url: "/contact" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "ScioGuidance", url: "/services/guidance" },
        { name: "ScioThrive", url: "/services/thrive" },
        { name: "ScioCare", url: "/services/care" },
        { name: "ScioLingua", url: "/services/lingua" },
        { name: "ScioSprints", url: "/services/sprints" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Sitemap", url: "/sitemap" }
      ]
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-green via-orange to-scio-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              Sitemap
            </h1>
            <p className="font-body text-body text-lg text-gray-100 max-w-3xl mx-auto">
              Navigate through all the pages and sections of our website.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteStructure.map((section, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="font-heading heading-secondary text-xl text-scio-blue mb-6 text-center">
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.url}
                          className="font-body text-gray-700 hover:text-scio-orange transition-colors duration-300 flex items-center group"
                        >
                          <ChevronRight className="w-4 h-4 mr-2 text-scio-orange group-hover:translate-x-1 transition-transform duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <Card className="mt-12 bg-white border-0 shadow-xl">
            <CardContent className="p-10 text-center">
              <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">
                Need Help Finding Something?
              </h2>
              <p className="font-body text-gray-700 mb-6">
                If you can&apos;t find what you&apos;re looking for, feel free to contact us directly.
              </p>
              <Link href="/contact">
                <button className="bg-scio-orange hover:bg-scio-orange-dark text-white px-8 py-3 rounded-lg font-heading font-semibold transition-all duration-300 transform hover:scale-105">
                  Contact Us
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
