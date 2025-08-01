'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { Copy, RefreshCw } from 'lucide-react'

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
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  })
  const [creatingUser, setCreatingUser] = useState(false)

  const fetchUsers = useCallback(async (page = 1, searchTerm = search, role = roleFilter) => {
    try {
      setLoading(true)
      console.log('Fetching users with params:', { page, searchTerm, role })
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(role && role !== 'all' && { role })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      console.log('Users fetch response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Users fetch error:', errorData)
        throw new Error(errorData.error || 'Failed to fetch users')
      }

      const data: UsersResponse = await response.json()
      console.log('Users data:', data)
      setUsers(data.users)
      setPagination(data.pagination)
      setError('')
      toast.success(`Loaded ${data.users.length} users`)
    } catch (err) {
      console.error('Users fetch exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMsg)
      toast.error(`Failed to load users: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter, pagination.limit])

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      console.log('Deleting user:', userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      console.log('Delete user response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('Delete user error:', error)
        throw new Error(error.error || 'Failed to delete user')
      }

      toast.success('User deleted successfully')
      // Refresh users list
      fetchUsers(pagination.page)
    } catch (err) {
      console.error('Delete user exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete user'
      toast.error(`Failed to delete user: ${errorMsg}`)
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
      password: ''
    })
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      console.log('Updating user:', editingUser.id, editForm)
      
      // Only send non-empty fields
      const updateData: Record<string, unknown> = {}
      if (editForm.name.trim()) updateData.name = editForm.name.trim()
      if (editForm.email.trim()) updateData.email = editForm.email.trim()
      if (editForm.role) updateData.role = editForm.role
      if (editForm.password.trim()) updateData.password = editForm.password.trim()

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      console.log('Update user response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('Update user error:', error)
        throw new Error(error.error || 'Failed to update user')
      }

      const data = await response.json()
      console.log('User updated successfully:', data)

      toast.success('User updated successfully')
      setEditDialogOpen(false)
      setEditingUser(null)
      setEditForm({ name: '', email: '', role: '', password: '' })
      
      // Refresh users list
      fetchUsers(pagination.page)
    } catch (err) {
      console.error('Update user exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to update user'
      toast.error(`Failed to update user: ${errorMsg}`)
    }
  }

  // Generate random password
  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setCreateForm(prev => ({ ...prev, password }))
  }

  // Copy password to clipboard
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(createForm.password)
      toast.success('Password copied to clipboard')
    } catch {
      toast.error('Failed to copy password')
    }
  }

  // Create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setCreatingUser(true)
    try {
      console.log('Creating new user:', createForm)
      
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          role: createForm.role,
          password: createForm.password
        })
      })

      console.log('Create user response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('Create user error:', error)
        throw new Error(error.error || 'Failed to create user')
      }

      const data = await response.json()
      console.log('User created successfully:', data)

      toast.success('User created successfully')
      setCreateDialogOpen(false)
      setCreateForm({ name: '', email: '', role: 'user', password: '' })
      
      // Refresh users list
      fetchUsers(1)
    } catch (err) {
      console.error('Create user exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to create user'
      toast.error(`Failed to create user: ${errorMsg}`)
    } finally {
      setCreatingUser(false)
    }
  }

  // Open create dialog and generate initial password
  const openCreateDialog = () => {
    setCreateForm({ name: '', email: '', role: 'user', password: '' })
    generatePassword()
    setCreateDialogOpen(true)
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
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-scio-blue hover:bg-scio-blue-dark text-white"
              onClick={openCreateDialog}
            >
              <i className="fas fa-plus mr-2"></i>
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Name *</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-email">Email *</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Select value={createForm.role} onValueChange={(value) => setCreateForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-password">Auto-Generated Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="create-password"
                    type="text"
                    value={createForm.password}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Password will be auto-generated"
                    className="font-mono text-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    title="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyPassword}
                    title="Copy password"
                    disabled={!createForm.password}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Save this password securely. The user will need it to log in.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={creatingUser}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-scio-blue hover:bg-scio-blue-dark"
                  disabled={creatingUser || !createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()}
                >
                  {creatingUser ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus mr-2"></i>
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(user)}
                        >
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (Optional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Leave blank to keep current password"
              />
              <p className="text-sm text-gray-500">
                Leave empty to keep the current password. Minimum 6 characters if changing.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-scio-blue hover:bg-scio-blue-dark">
                Update User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}