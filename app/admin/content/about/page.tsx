import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AboutContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl text-gray-800">About Page Content</h1>
        <Button className="bg-scio-blue hover:bg-scio-blue-dark text-white">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Mission Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mission Statement</label>
              <textarea 
                className="w-full h-24 p-3 border rounded-lg resize-none"
                defaultValue="To empower individuals and organizations through innovative educational solutions..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vision Statement</label>
              <textarea 
                className="w-full h-24 p-3 border rounded-lg resize-none"
                defaultValue="To be the leading provider of transformative educational experiences..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Excellence", description: "We strive for the highest standards in everything we do" },
                { title: "Innovation", description: "We embrace new ideas and technologies to enhance learning" },
                { title: "Integrity", description: "We act with honesty and transparency in all our interactions" },
                { title: "Empowerment", description: "We believe in unlocking human potential through education" }
              ].map((value, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <Input 
                    defaultValue={value.title}
                    className="mb-2 font-medium"
                    placeholder="Value title"
                  />
                  <textarea 
                    className="w-full h-16 p-2 border rounded resize-none"
                    defaultValue={value.description}
                    placeholder="Value description"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Team Introduction</label>
              <textarea 
                className="w-full h-24 p-3 border rounded-lg resize-none"
                defaultValue="Our team of experienced educators and industry professionals..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company History</label>
              <textarea 
                className="w-full h-32 p-3 border rounded-lg resize-none"
                defaultValue="Founded with a vision to transform education, ScioLabs has been..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
