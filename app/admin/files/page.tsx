'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  Upload, 
  Search, 
  Trash2, 
  Download,
  Eye,
  Folder,
  File,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Loader2,
  RefreshCw,
  Grid3X3,
  List,
} from 'lucide-react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'

interface MediaFile {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  mimeType?: string
  url?: string
  path: string
  folder?: string
  createdAt: string
  uploadedBy: {
    id: string
    name: string
  }
}

export default function FilesManagementPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (filterType !== 'all') params.set('type', filterType)

      const response = await fetch(`/api/admin/files?${params}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      } else {
        toast.error('Failed to fetch files')
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to fetch files')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterType])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    const formData = new FormData()
    
    acceptedFiles.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/admin/files/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Uploaded ${data.uploadedCount} file(s) successfully`)
        fetchFiles()
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }, [fetchFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  })

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId])
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(files.map(f => f.id))
    } else {
      setSelectedFiles([])
    }
  }

  const handleDeleteFiles = async () => {
    if (selectedFiles.length === 0) return

    try {
      const response = await fetch('/api/admin/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedFiles })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        setSelectedFiles([])
        setDeleteDialogOpen(false)
        fetchFiles()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete files')
    }
  }

  const getFileIcon = (file: MediaFile) => {
    if (!file.mimeType) return <File className="h-8 w-8 text-gray-500" />
    
    if (file.mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-green-500" />
    if (file.mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-red-500" />
    if (file.mimeType.startsWith('audio/')) return <Music className="h-8 w-8 text-purple-500" />
    if (file.mimeType.includes('text') || file.mimeType.includes('document')) 
      return <FileText className="h-8 w-8 text-blue-500" />
    
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePreview = (file: MediaFile) => {
    setPreviewFile(file)
    setPreviewDialogOpen(true)
  }

  const filteredFiles = files.filter(file => {
    if (filterType === 'all') return true
    if (filterType === 'images') return file.mimeType?.startsWith('image/')
    if (filterType === 'videos') return file.mimeType?.startsWith('video/')
    if (filterType === 'audio') return file.mimeType?.startsWith('audio/')
    if (filterType === 'documents') return file.mimeType?.includes('text') || file.mimeType?.includes('document')
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 flex items-center gap-2">
            <Folder className="w-7 h-7 text-scio-blue" />
            File Management
          </h1>
          <p className="text-gray-600 mt-1">Manage uploaded files and media</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFiles}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-scio-blue transition-colors">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer ${
              isDragActive ? 'bg-blue-50' : ''
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="py-8">
                <Loader2 className="h-12 w-12 animate-spin text-scio-blue mx-auto mb-4" />
                <p className="text-scio-blue font-medium">Uploading files...</p>
              </div>
            ) : (
              <div className="py-8">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports images, videos, audio, and documents
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
              </SelectContent>
            </Select>

            {selectedFiles.length > 0 && (
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedFiles.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Files</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {selectedFiles.length} selected file(s)? 
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteFiles}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Files ({filteredFiles.length})</span>
            {filteredFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-scio-blue" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No files found</p>
              <p className="text-gray-400">Upload some files to get started</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="group relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
                    />
                  </div>
                  
                  <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
                      {file.mimeType?.startsWith('image/') && file.url ? (
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        getFileIcon(file)
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      {file.size && (
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      )}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handlePreview(file)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {file.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 w-12">
                      <Checkbox
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Size</th>
                    <th className="text-left p-3">Uploaded By</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center">
                            {file.mimeType?.startsWith('image/') && file.url ? (
                              <Image
                                src={file.url}
                                alt={file.name}
                                width={32}
                                height={32}
                                className="object-cover rounded"
                              />
                            ) : (
                              getFileIcon(file)
                            )}
                          </div>
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {file.mimeType || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {file.size ? formatFileSize(file.size) : '-'}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {file.uploadedBy.name}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(file)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {file.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                {previewFile.mimeType?.startsWith('image/') && previewFile.url ? (
                  <Image
                    src={previewFile.url}
                    alt={previewFile.name}
                    width={600}
                    height={400}
                    className="object-contain max-h-96"
                  />
                ) : previewFile.mimeType?.startsWith('video/') && previewFile.url ? (
                  <video controls className="max-h-96 max-w-full">
                    <source src={previewFile.url} type={previewFile.mimeType} />
                  </video>
                ) : previewFile.mimeType?.startsWith('audio/') && previewFile.url ? (
                  <div className="w-full p-8">
                    <div className="flex items-center justify-center mb-4">
                      <Music className="h-16 w-16 text-purple-500" />
                    </div>
                    <audio controls className="w-full">
                      <source src={previewFile.url} type={previewFile.mimeType} />
                    </audio>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    {getFileIcon(previewFile)}
                    <p className="text-sm text-gray-500 mt-2">No preview available</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Size:</strong> {previewFile.size ? formatFileSize(previewFile.size) : 'Unknown'}
                </div>
                <div>
                  <strong>Type:</strong> {previewFile.mimeType || 'Unknown'}
                </div>
                <div>
                  <strong>Uploaded by:</strong> {previewFile.uploadedBy.name}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(previewFile.createdAt)}
                </div>
              </div>
              
              {previewFile.url && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(previewFile.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(previewFile.url!)
                      toast.success('URL copied to clipboard')
                    }}
                  >
                    Copy URL
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
