import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { servicesData } from "@/lib/services-data"

export default function ServicesContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl text-gray-800">Services Content</h1>
        <Button className="bg-scio-blue hover:bg-scio-blue-dark text-white">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {servicesData.map((service, index) => (
          <Card key={service.id} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-scio-blue mr-2">{service.title}</span>
                <Button size="sm" variant="outline">Edit</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Title</label>
                    <input 
                      className="w-full p-2 border rounded-lg"
                      defaultValue={service.title}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <textarea 
                      className="w-full h-20 p-2 border rounded-lg resize-none"
                      defaultValue={service.subtitle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      className="w-full h-24 p-2 border rounded-lg resize-none"
                      defaultValue={service.description}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={feature.id} className="p-3 border rounded-lg">
                        <input 
                          className="w-full mb-2 p-1 border rounded"
                          defaultValue={feature.title}
                          placeholder="Feature title"
                        />
                        <textarea 
                          className="w-full h-16 p-1 border rounded resize-none text-sm"
                          defaultValue={feature.description}
                          placeholder="Feature description"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
