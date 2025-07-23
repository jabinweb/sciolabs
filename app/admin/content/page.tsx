import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function WebsiteContentPage() {
  const contentSections = [
    {
      title: "Homepage",
      description: "Hero section, services overview, and main content",
      icon: "fas fa-home",
      color: "bg-blue-500",
      href: "/admin/content/homepage"
    },
    {
      title: "Services",
      description: "Service descriptions, features, and pricing",
      icon: "fas fa-cogs",
      color: "bg-green-500",
      href: "/admin/content/services"
    },
    {
      title: "About Page",
      description: "Company information, mission, and team details",
      icon: "fas fa-info-circle",
      color: "bg-purple-500",
      href: "/admin/content/about"
    },
    {
      title: "Testimonials",
      description: "Customer reviews and success stories",
      icon: "fas fa-quote-right",
      color: "bg-orange-500",
      href: "/admin/content/testimonials"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-gray-800 mb-2">Website Content Management</h1>
        <p className="font-body text-gray-600">Manage all your website content from one place</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentSections.map((section, index) => (
          <Link key={index} href={section.href}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                    <i className={`${section.icon} text-white text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold mb-2">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                    <div className="flex items-center mt-3 text-scio-blue text-sm">
                      <span>Edit Content</span>
                      <i className="fas fa-arrow-right ml-2"></i>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Changes */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Content Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { section: "Homepage Hero", change: "Updated hero text", date: "2 hours ago" },
              { section: "Services", change: "Added new service features", date: "1 day ago" },
              { section: "Testimonials", change: "Added 3 new testimonials", date: "3 days ago" }
            ].map((change, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{change.section}</h4>
                  <p className="text-sm text-gray-600">{change.change}</p>
                </div>
                <span className="text-xs text-gray-500">{change.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
