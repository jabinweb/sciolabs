import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestimonialsContentPage() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "High School Teacher",
      content: "ScioLabs transformed how I approach career guidance. The tools and resources provided have helped hundreds of my students find their path.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "University Student",
      content: "The career counseling sessions were incredibly insightful. I gained clarity about my career goals and the steps needed to achieve them.",
      rating: 5
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Corporate HR Manager",
      content: "ScioThrive's corporate training programs significantly improved our team's communication and productivity. Highly recommended!",
      rating: 5
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl text-gray-800">Testimonials Management</h1>
        <Button className="bg-scio-blue hover:bg-scio-blue-dark text-white">
          <i className="fas fa-plus mr-2"></i>
          Add Testimonial
        </Button>
      </div>

      {/* Add New Testimonial */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Add New Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name</label>
                <Input placeholder="Enter client name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role/Position</label>
                <Input placeholder="Enter role or position" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                <Input placeholder="Enter company name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Testimonial Content</label>
                <textarea 
                  className="w-full h-32 p-3 border rounded-lg resize-none"
                  placeholder="Enter the testimonial content..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client Photo (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <i className="fas fa-user-circle text-gray-400 text-2xl mb-2"></i>
                  <p className="text-gray-600">Upload client photo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-scio-orange hover:bg-scio-orange-dark text-white">
              Add Testimonial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Testimonials */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Existing Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline" className="text-red-600">Delete</Button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">&ldquo;{testimonial.content}&rdquo;</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
