'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Filter, RefreshCw, Eye, User, Mail, Phone, Calendar, Tag, MapPin, FileText, Briefcase, School, Heart, Code } from "lucide-react";
import { toast } from 'sonner'

// Universal FormResponse type
interface FormResponse {
  id: string
  formName: string
  data: Record<string, unknown>
  email?: string
  phone?: string
  status?: string
  tags?: string
  source?: string
  createdAt: string
  updatedAt: string
}

export default function FormResponsesPage() {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      setError("");
      try {
        console.log('Fetching form responses...')
        const res = await fetch("/api/admin/form-responses");
        console.log('Form responses fetch status:', res.status)
        
        if (!res.ok) {
          const data = await res.json();
          const errorMsg = data.error || "Failed to fetch responses"
          console.error('Form responses fetch error:', data)
          setError(errorMsg);
          setResponses([]);
          toast.error(`Failed to load responses: ${errorMsg}`)
        } else {
          const data = await res.json();
          console.log('Form responses data:', data)
          setResponses(data.responses || []);
          if (data.responses?.length > 0) {
            toast.success(`Loaded ${data.responses.length} form responses`)
          }
        }
      } catch (err) {
        console.error('Form responses fetch exception:', err)
        setError("Failed to fetch responses");
        setResponses([]);
        toast.error("Failed to load responses. Please try again.")
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  // Filter responses by formName
  const filteredResponses = filter === "all"
    ? responses
    : responses.filter(r => r.formName === filter);

  // Get unique form names for filter dropdown
  const formNames = Array.from(new Set(responses.map(r => r.formName)));

  const handleViewResponse = (response: FormResponse) => {
    setSelectedResponse(response);
    setViewDialogOpen(true);
  };

  const formatFieldValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const getFieldIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey.includes('name')) return <User className="w-4 h-4 text-blue-500" />;
    if (lowerKey.includes('email')) return <Mail className="w-4 h-4 text-green-500" />;
    if (lowerKey.includes('phone')) return <Phone className="w-4 h-4 text-orange-500" />;
    if (lowerKey.includes('message') || lowerKey.includes('comment')) return <FileText className="w-4 h-4 text-purple-500" />;
    if (lowerKey.includes('service')) return <Briefcase className="w-4 h-4 text-scio-blue" />;
    if (lowerKey.includes('position') || lowerKey.includes('job')) return <Briefcase className="w-4 h-4 text-scio-blue" />;
    if (lowerKey.includes('experience')) return <School className="w-4 h-4 text-indigo-500" />;
    if (lowerKey.includes('location') || lowerKey.includes('address')) return <MapPin className="w-4 h-4 text-red-500" />;
    if (lowerKey.includes('resume') || lowerKey.includes('cv')) return <FileText className="w-4 h-4 text-gray-500" />;
    if (lowerKey.includes('date')) return <Calendar className="w-4 h-4 text-teal-500" />;
    
    return <Tag className="w-4 h-4 text-gray-400" />;
  };

  const getFormTypeIcon = (formName: string) => {
    switch (formName.toLowerCase()) {
      case 'contact':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'job-application':
        return <Briefcase className="w-5 h-5 text-scio-blue" />;
      case 'newsletter':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'consultation':
        return <Heart className="w-5 h-5 text-red-500" />;
      default:
        return <ClipboardList className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/id$/i, 'ID')
      .replace(/url$/i, 'URL')
      .replace(/cv$/i, 'CV');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-scio-blue" />
            Form Responses
          </h1>
          <p className="text-gray-600 mt-1">View and manage all form submissions</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-scio-blue"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Forms</option>
              {formNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Responses ({filteredResponses.length})</span>
            {loading && <i className="fas fa-spinner fa-spin text-scio-blue"></i>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <i className="fas fa-spinner fa-spin text-3xl text-scio-blue mb-4"></i>
              <p className="text-gray-600">Loading responses...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 py-8 text-center">{error}</div>
          ) : filteredResponses.length === 0 ? (
            <div className="text-gray-500 py-8 text-center">No responses found for this filter.</div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg">
              <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
                <thead className="bg-scio-blue/10">
                  <tr>
                    <th className="p-3 text-left font-heading">Form</th>
                    <th className="p-3 text-left font-heading">Email</th>
                    <th className="p-3 text-left font-heading">Phone</th>
                    <th className="p-3 text-left font-heading">Status</th>
                    <th className="p-3 text-left font-heading">Source</th>
                    <th className="p-3 text-left font-heading">Date</th>
                    <th className="p-3 text-left font-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map(r => (
                    <tr key={r.id} className="border-b hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 font-medium">
                        <Badge variant="outline" className="bg-scio-blue/10 text-scio-blue border-scio-blue">{r.formName}</Badge>
                      </td>
                      <td className="p-3">{r.email || "-"}</td>
                      <td className="p-3">{r.phone || "-"}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className="text-xs">{r.status || "new"}</Badge>
                      </td>
                      <td className="p-3">{r.source || "-"}</td>
                      <td className="p-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResponse(r)}
                          className="flex items-center gap-1 hover:bg-scio-blue hover:text-white transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced View Response Dialog with Proper Scrolling */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl">
              {selectedResponse && getFormTypeIcon(selectedResponse.formName)}
              <span>Form Response Details</span>
              {selectedResponse && (
                <Badge variant="outline" className="ml-auto">
                  {selectedResponse.formName}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResponse && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6 pb-4">
                {/* Response Meta Information */}
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium text-gray-700">Submitted:</span>
                          <p className="text-gray-600">{new Date(selectedResponse.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {selectedResponse.source && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-700">Source:</span>
                            <p className="text-gray-600">{selectedResponse.source}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <Badge variant="secondary" className="ml-2">
                            {selectedResponse.status || "new"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information (if available) */}
                {(selectedResponse.email || selectedResponse.phone) && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-scio-blue" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedResponse.email && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <p className="text-blue-600">
                              <a href={`mailto:${selectedResponse.email}`} className="hover:underline">
                                {selectedResponse.email}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedResponse.phone && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Phone className="w-4 h-4 text-green-500" />
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>
                            <p className="text-green-600">
                              <a href={`tel:${selectedResponse.phone}`} className="hover:underline">
                                {selectedResponse.phone}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Form Fields */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-scio-blue" />
                      Form Fields
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedResponse.data).map(([key, value]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            {getFieldIcon(key)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 mb-1">
                                {formatFieldName(key)}
                              </div>
                              <div className="text-gray-700 break-words">
                                {key.toLowerCase().includes('url') && value && typeof value === 'string' ? (
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline break-all"
                                  >
                                    {value}
                                  </a>
                                ) : key.toLowerCase().includes('email') && value && typeof value === 'string' ? (
                                  <a
                                    href={`mailto:${value}`}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {value}
                                  </a>
                                ) : key.toLowerCase().includes('phone') && value && typeof value === 'string' ? (
                                  <a
                                    href={`tel:${value}`}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {value}
                                  </a>
                                ) : key.toLowerCase().includes('message') || key.toLowerCase().includes('comment') ? (
                                  <div className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {formatFieldValue(key, value)}
                                  </div>
                                ) : (
                                  <span className="font-mono text-sm break-all">
                                    {formatFieldValue(key, value)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Tags (if available) */}
                {selectedResponse.tags && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="w-5 h-5 text-scio-blue" />
                        Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <span className="text-gray-700">{selectedResponse.tags}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Raw Data (Collapsible) */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="w-5 h-5 text-scio-blue" />
                      Raw Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <details className="group">
                      <summary className="cursor-pointer text-scio-blue hover:text-scio-blue-dark font-medium flex items-center gap-2 mb-3">
                        <span>View JSON Data</span>
                        <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                      </summary>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(selectedResponse.data, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
