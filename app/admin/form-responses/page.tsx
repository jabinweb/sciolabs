'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Filter, RefreshCw } from "lucide-react";
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
                    <th className="p-3 text-left font-heading">Fields</th>
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
                      <td className="p-3 max-w-xs break-words">
                        <details>
                          <summary className="cursor-pointer text-scio-blue underline">View</summary>
                          <pre className="whitespace-pre-wrap text-xs mt-2 bg-gray-50 p-2 rounded">{JSON.stringify(r.data, null, 2)}</pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
