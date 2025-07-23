import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  const stats = [
    { label: 'Total Users', value: '1,234', icon: 'fas fa-users', color: 'bg-blue-500' },
    { label: 'Blog Posts', value: '56', icon: 'fas fa-file-alt', color: 'bg-green-500' },
    { label: 'Newsletter Subscribers', value: '10,234', icon: 'fas fa-envelope', color: 'bg-orange-500' },
    { label: 'Page Views', value: '45,678', icon: 'fas fa-eye', color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-gray-800 mb-2">
          Welcome back, {session?.user?.name || session?.user?.email}!

        </h1>
        <p className="font-body text-gray-600">
          Manage your ScioLabs platform from this admin dashboard.
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="font-heading text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-white text-lg`}></i>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-gray-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/admin/blog/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="fas fa-plus text-scio-blue"></i>
                <span className="font-medium">Create New Blog Post</span>
              </div>
            </a>
            <a href="/admin/users" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="fas fa-user-plus text-scio-orange"></i>
                <span className="font-medium">Manage Users</span>
              </div>
            </a>
            <a href="/admin/content/homepage" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="fas fa-edit text-green-500"></i>
                <span className="font-medium">Edit Homepage Content</span>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-sm">New user registered</p>
              <p className="text-xs text-gray-600">2 hours ago</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-sm">Blog post published</p>
              <p className="text-xs text-gray-600">5 hours ago</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-medium text-sm">Newsletter sent</p>
              <p className="text-xs text-gray-600">1 day ago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
