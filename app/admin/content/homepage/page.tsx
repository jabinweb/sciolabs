import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomepageContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl text-gray-800">Homepage Content</h1>
        <Button className="bg-scio-blue hover:bg-scio-blue-dark text-white">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Main Headline</label>
              <Input 
                defaultValue="Empowering Lives Through Guidance, Education, and Excellence"
                className="text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea 
                className="w-full h-20 p-3 border rounded-lg resize-none"
                defaultValue="Transforming careers and lives through personalized guidance and innovative training programs."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Button Text</label>
              <Input defaultValue="Get Started Today" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Statistics Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Educators Trained</label>
                <Input defaultValue="15000+" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Counseling Sessions</label>
                <Input defaultValue="250+" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Learning Hours</label>
                <Input defaultValue="70,000+" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Institutional Partnerships</label>
                <Input defaultValue="20+" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input defaultValue="About ScioLabs" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                className="w-full h-32 p-3 border rounded-lg resize-none"
                defaultValue="ScioLabs is dedicated to empowering individuals and organizations through comprehensive educational solutions..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
