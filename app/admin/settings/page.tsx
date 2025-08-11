'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner'
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database, 
  Palette, 
  Users, 
  Bell,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  TestTube,
} from 'lucide-react'

interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    contactEmail: string
    contactPhone: string
    address: string
    socialMedia: {
      facebook?: string
      twitter?: string
      linkedin?: string
      instagram?: string
    }
  }
  email: {
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    smtpFromName: string
    smtpFromEmail: string
    adminEmails: string[]
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogImage?: string
    googleAnalyticsId?: string
    googleSiteVerification?: string
  }
  maintenance: {
    enabled: boolean
    message: string
    allowedIps: string[]
  }
  features: {
    blogEnabled: boolean
    newsletterEnabled: boolean
    contactFormEnabled: boolean
    jobApplicationsEnabled: boolean
  }
  security: {
    maxLoginAttempts: number
    sessionTimeout: number
    passwordMinLength: number
    requireEmailVerification: boolean
  }
}

interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      socialMedia: {}
    },
    email: {
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      smtpFromName: '',
      smtpFromEmail: '',
      adminEmails: []
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    },
    maintenance: {
      enabled: false,
      message: '',
      allowedIps: []
    },
    features: {
      blogEnabled: true,
      newsletterEnabled: true,
      contactFormEnabled: true,
      jobApplicationsEnabled: true
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireEmailVerification: false
    }
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAllowedIp, setNewAllowedIp] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchCategories()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data.settings }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/settings/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const saveSettings = async (section?: keyof SiteSettings) => {
    try {
      setSaving(true)
      const payload = section ? { [section]: settings[section] } : settings
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(`${section ? `${section.charAt(0).toUpperCase() + section.slice(1)} settings` : 'Settings'} saved successfully`)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const testEmailConnection = async () => {
    try {
      setTestingEmail(true)
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost: settings.email.smtpHost,
          smtpPort: settings.email.smtpPort,
          smtpUser: settings.email.smtpUser,
          smtpPassword: settings.email.smtpPassword,
          smtpFromName: settings.email.smtpFromName,
          smtpFromEmail: settings.email.smtpFromEmail
        })
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Email test successful! Check your inbox.')
      } else {
        toast.error(`Email test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error testing email:', error)
      toast.error('Failed to test email connection')
    } finally {
      setTestingEmail(false)
    }
  }

  const addCategory = async () => {
    if (!newCategory.name.trim()) return

    try {
      const response = await fetch('/api/admin/settings/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      if (response.ok) {
        const data = await response.json()
        setCategories([...categories, data.category])
        setNewCategory({ name: '', description: '' })
        toast.success('Category created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    }
  }

  const updateCategory = async (id: string, data: { name: string; description?: string }) => {
    try {
      const response = await fetch(`/api/admin/settings/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const updatedData = await response.json()
        setCategories(categories.map(cat => cat.id === id ? updatedData.category : cat))
        setEditingCategory(null)
        toast.success('Category updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/settings/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== id))
        toast.success('Category deleted successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const addAdminEmail = () => {
    if (newAdminEmail && !settings.email.adminEmails.includes(newAdminEmail)) {
      setSettings(prev => ({
        ...prev,
        email: {
          ...prev.email,
          adminEmails: [...prev.email.adminEmails, newAdminEmail]
        }
      }))
      setNewAdminEmail('')
    }
  }

  const removeAdminEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        adminEmails: prev.email.adminEmails.filter(e => e !== email)
      }
    }))
  }

  const addAllowedIp = () => {
    if (newAllowedIp && !settings.maintenance.allowedIps.includes(newAllowedIp)) {
      setSettings(prev => ({
        ...prev,
        maintenance: {
          ...prev.maintenance,
          allowedIps: [...prev.maintenance.allowedIps, newAllowedIp]
        }
      }))
      setNewAllowedIp('')
    }
  }

  const removeAllowedIp = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        allowedIps: prev.maintenance.allowedIps.filter(i => i !== ip)
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-scio-blue" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 flex items-center gap-2">
            <Settings className="w-7 h-7 text-scio-blue" />
            Site Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your website configuration and preferences</p>
        </div>
        <Button 
          onClick={() => saveSettings()} 
          disabled={saving}
          className="bg-scio-blue hover:bg-scio-blue-dark text-white"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-scio-blue" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, siteName: e.target.value }
                    }))}
                    placeholder="ScioLabs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.general.siteUrl}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, siteUrl: e.target.value }
                    }))}
                    placeholder="https://sciolabs.in"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, siteDescription: e.target.value }
                  }))}
                  placeholder="Transforming careers and lives through personalized guidance and innovative training programs."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, contactEmail: e.target.value }
                    }))}
                    placeholder="info@sciolabs.in"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.general.contactPhone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, contactPhone: e.target.value }
                    }))}
                    placeholder="+91 9495212484"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, address: e.target.value }
                  }))}
                  placeholder="N-304, Ashiyana Sector – N, Lucknow – 226012, India"
                  rows={2}
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.general.socialMedia.facebook || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { 
                          ...prev.general, 
                          socialMedia: { ...prev.general.socialMedia, facebook: e.target.value }
                        }
                      }))}
                      placeholder="https://facebook.com/sciolabs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.general.socialMedia.twitter || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { 
                          ...prev.general, 
                          socialMedia: { ...prev.general.socialMedia, twitter: e.target.value }
                        }
                      }))}
                      placeholder="https://twitter.com/sciolabs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={settings.general.socialMedia.linkedin || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { 
                          ...prev.general, 
                          socialMedia: { ...prev.general.socialMedia, linkedin: e.target.value }
                        }
                      }))}
                      placeholder="https://linkedin.com/company/sciolabs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.general.socialMedia.instagram || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { 
                          ...prev.general, 
                          socialMedia: { ...prev.general.socialMedia, instagram: e.target.value }
                        }
                      }))}
                      placeholder="https://instagram.com/sciolabs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('general')} 
                  disabled={saving}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-scio-blue" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpHost: e.target.value }
                    }))}
                    placeholder="smtp.hostinger.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpPort: e.target.value }
                    }))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpUser: e.target.value }
                    }))}
                    placeholder="info@sciolabs.in"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={settings.email.smtpPassword}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPassword: e.target.value }
                      }))}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpFromName">From Name</Label>
                  <Input
                    id="smtpFromName"
                    value={settings.email.smtpFromName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpFromName: e.target.value }
                    }))}
                    placeholder="ScioLabs"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpFromEmail">From Email</Label>
                  <Input
                    id="smtpFromEmail"
                    type="email"
                    value={settings.email.smtpFromEmail}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpFromEmail: e.target.value }
                    }))}
                    placeholder="info@sciolabs.in"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-semibold mb-4">Admin Notification Emails</h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@sciolabs.in"
                      type="email"
                    />
                    <Button onClick={addAdminEmail} disabled={!newAdminEmail}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {settings.email.adminEmails.map((email, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {email}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => removeAdminEmail(email)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={testEmailConnection}
                  disabled={testingEmail || !settings.email.smtpHost}
                >
                  {testingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Email
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => saveSettings('email')} 
                  disabled={saving}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-scio-blue" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.seo.metaTitle}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: e.target.value }
                  }))}
                  placeholder="ScioLabs - Upward Equipping"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.seo.metaDescription}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: e.target.value }
                  }))}
                  placeholder="Transforming careers and lives through personalized guidance and innovative training programs."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.seo.metaKeywords}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaKeywords: e.target.value }
                  }))}
                  placeholder="education, training, career guidance, professional development"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.seo.googleAnalyticsId || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, googleAnalyticsId: e.target.value }
                    }))}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="googleSiteVerification">Google Site Verification</Label>
                  <Input
                    id="googleSiteVerification"
                    value={settings.seo.googleSiteVerification || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      seo: { ...prev.seo, googleSiteVerification: e.target.value }
                    }))}
                    placeholder="verification-code"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('seo')} 
                  disabled={saving}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save SEO Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-scio-blue" />
                Blog Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Description (optional)"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                />
                <Button 
                  onClick={addCategory}
                  disabled={!newCategory.name.trim()}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={editingCategory?.name || ''}
                                onChange={(e) => setEditingCategory(prev => 
                                  prev ? { ...prev, name: e.target.value } : null
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input
                                value={editingCategory?.description || ''}
                                onChange={(e) => setEditingCategory(prev => 
                                  prev ? { ...prev, description: e.target.value } : null
                                )}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingCategory(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => editingCategory && updateCategory(editingCategory.id, {
                                  name: editingCategory.name,
                                  description: editingCategory.description
                                })}
                                className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-scio-blue" />
                Feature Toggles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Blog System</h4>
                    <p className="text-sm text-gray-600">Enable/disable the blog functionality</p>
                  </div>
                  <Switch
                    checked={settings.features.blogEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      features: { ...prev.features, blogEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-sm text-gray-600">Enable/disable newsletter subscriptions</p>
                  </div>
                  <Switch
                    checked={settings.features.newsletterEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      features: { ...prev.features, newsletterEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Contact Form</h4>
                    <p className="text-sm text-gray-600">Enable/disable contact form submissions</p>
                  </div>
                  <Switch
                    checked={settings.features.contactFormEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      features: { ...prev.features, contactFormEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Job Applications</h4>
                    <p className="text-sm text-gray-600">Enable/disable job application submissions</p>
                  </div>
                  <Switch
                    checked={settings.features.jobApplicationsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      features: { ...prev.features, jobApplicationsEnabled: checked }
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('features')} 
                  disabled={saving}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Feature Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-scio-blue" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                    }))}
                    min="1"
                    max="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                    }))}
                    min="5"
                    max="1440"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                    }))}
                    min="6"
                    max="50"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-gray-600">Require email verification for new users</p>
                  </div>
                  <Switch
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, requireEmailVerification: checked }
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('security')} 
                  disabled={saving}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-scio-blue" />
                Maintenance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Enable Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">Show maintenance page to all visitors</p>
                </div>
                <Switch
                  checked={settings.maintenance.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    maintenance: { ...prev.maintenance, enabled: checked }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenance.message}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    maintenance: { ...prev.maintenance, message: e.target.value }
                  }))}
                  placeholder="We're currently performing scheduled maintenance. Please check back soon."
                  rows={3}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Allowed IP Addresses</h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAllowedIp}
                      onChange={(e) => setNewAllowedIp(e.target.value)}
                      placeholder="127.0.0.1"
                    />
                    <Button onClick={addAllowedIp} disabled={!newAllowedIp}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {settings.maintenance.allowedIps.map((ip, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {ip}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => removeAllowedIp(ip)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('maintenance')} 
                  disabled={saving}
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Maintenance Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
