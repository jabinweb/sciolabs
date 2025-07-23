'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  updatedAt: string
  emailVerified: string | null
  _count: {
    sessions: number
  }
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async (page = 1, searchTerm = search, role = roleFilter) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(role && role !== 'all' && { role })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter, pagination.limit])

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }

      // Refresh users list
      fetchUsers(pagination.page)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = () => {
    fetchUsers(1, search, roleFilter)
  }

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800'
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-scio-blue mb-4"></i>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and their permissions</p>
        </div>
        <Button className="bg-scio-blue hover:bg-scio-blue-dark text-white">
          <i className="fas fa-plus mr-2"></i>
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-scio-blue hover:bg-scio-blue-dark text-white">
              <i className="fas fa-search mr-2"></i>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center text-red-800">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Users ({pagination.total})</span>
            {loading && <i className="fas fa-spinner fa-spin text-scio-blue"></i>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-heading">Name</th>
                  <th className="text-left p-3 font-heading">Email</th>
                  <th className="text-left p-3 font-heading">Role</th>
                  <th className="text-left p-3 font-heading">Status</th>
                  <th className="text-left p-3 font-heading">Joined</th>
                  <th className="text-left p-3 font-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{user.name || 'No name'}</p>
                        <p className="text-sm text-gray-500">{user.id}</p>
                      </div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm">
                          {user.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => deleteUser(user.id)}
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No users found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={pagination.page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                    className={pagination.page === i + 1 ? "bg-scio-blue" : ""}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}