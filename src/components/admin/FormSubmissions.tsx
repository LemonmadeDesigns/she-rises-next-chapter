import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { syncFromGoogleSheets } from "@/config/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Mail,
  Phone,
  Calendar,
  Trash2,
  Eye,
  Archive,
  Filter,
  Download,
  RefreshCw,
  Search,
  Copy,
  CloudDownload
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FormSubmission {
  id: string;
  form_type: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  category?: string;
  form_data?: Record<string, any>;
  status: 'unread' | 'read' | 'responded' | 'archived';
  notes?: string;
  read_at?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  insertion_order?: number;
  original_created_at?: string | null;
}

const PAGE_SIZE = 15;

const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formTypeFilter, setFormTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { toast } = useToast();

  // Fetch submissions — newest first by created_at, with id as a stable
  // tiebreaker so the order never reshuffles between refreshes.
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

      if (error) throw error;

      setSubmissions((data || []) as unknown as FormSubmission[]);
      setFilteredSubmissions((data || []) as unknown as FormSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load form submissions",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync from Google Sheets
  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncFromGoogleSheets();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to sync');
      }

      toast({
        title: "Sync Complete",
        description: `Imported ${result.imported} new submissions, skipped ${result.skipped} duplicates`,
      });

      // Refresh submissions after sync
      await fetchSubmissions();
    } catch (error) {
      console.error('Error syncing:', error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync from Google Sheets",
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...submissions];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Form type filter
    if (formTypeFilter !== "all") {
      filtered = filtered.filter(s => s.form_type === formTypeFilter);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.message?.toLowerCase().includes(query) ||
        s.subject?.toLowerCase().includes(query)
      );
    }

    setFilteredSubmissions(filtered);
    setCurrentPage(1);
  }, [statusFilter, formTypeFilter, searchQuery, submissions]);

  // Pagination derived state
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedSubmissions = filteredSubmissions.slice(pageStart, pageStart + PAGE_SIZE);

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      fetchSubmissions();
      toast({
        title: "Success",
        description: "Marked as read",
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update submission",
      });
    }
  };

  // Update status
  const updateStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'responded') {
        updates.responded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('form_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      fetchSubmissions();
      toast({
        title: "Success",
        description: `Status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  // Update notes
  const updateNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;

      fetchSubmissions();
      toast({
        title: "Success",
        description: "Notes updated",
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notes",
      });
    }
  };

  // Delete submission (only from database, NOT from Google Sheets)
  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSubmissions();
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
      toast({
        title: "Success",
        description: "Submission deleted from database (Google Sheets unchanged)",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete submission",
      });
    }
  };

  // View submission
  const viewSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
    if (submission.status === 'unread') {
      markAsRead(submission.id);
    }
  };

  // Export to CSV — preserves insertion_order, includes original_created_at
  const exportToCSV = () => {
    const headers = [
      'Order',
      'Submitted At',
      'Original Submitted At',
      'Created At (DB)',
      'Name',
      'Email',
      'Phone',
      'Form Type',
      'Subject',
      'Message',
      'Status',
    ];
    const rows = filteredSubmissions.map(s => [
      s.insertion_order ?? '',
      new Date(s.original_created_at || s.created_at).toLocaleString(),
      s.original_created_at ? new Date(s.original_created_at).toLocaleString() : '',
      new Date(s.created_at).toLocaleString(),
      s.name,
      s.email,
      s.phone || '',
      s.form_type,
      s.subject || '',
      (s.message || '').replace(/"/g, '""'),
      s.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get unique form types
  const formTypes = Array.from(new Set(submissions.map(s => s.form_type)));

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'read': return 'bg-blue-500';
      case 'responded': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-royal-plum">Form Submissions</h2>
          <p className="text-muted-foreground">
            Manage and respond to website form submissions ({filteredSubmissions.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSync}
            variant="outline"
            size="sm"
            disabled={syncing}
          >
            <CloudDownload className={`h-4 w-4 mr-2 ${syncing ? 'animate-bounce' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync from Google Sheets'}
          </Button>
          <Button onClick={fetchSubmissions} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Form Type Filter */}
            <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Forms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {formTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-crown-gold" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No submissions found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or check back later
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paginatedSubmissions.map((submission) => (
            <Card key={submission.id} className={`${submission.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {typeof submission.insertion_order === 'number' && (
                        <Badge variant="secondary" className="font-mono">
                          #{submission.insertion_order}
                        </Badge>
                      )}
                      <CardTitle className="text-lg">{submission.name}</CardTitle>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      <Badge variant="outline">{submission.form_type}</Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${submission.email}`} className="hover:text-crown-gold">
                          {submission.email}
                        </a>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${submission.phone}`} className="hover:text-crown-gold">
                            {submission.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Submitted {formatDistanceToNow(
                            new Date(submission.original_created_at || submission.created_at),
                            { addSuffix: true }
                          )}
                          <span className="ml-2 text-xs opacity-70">
                            ({new Date(submission.original_created_at || submission.created_at).toLocaleString()})
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewSubmission(submission)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSubmissionToDelete(submission.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {submission.subject && (
                  <p className="font-medium mb-2">Subject: {submission.subject}</p>
                )}
                {submission.category && (
                  <p className="text-sm text-muted-foreground mb-2">Category: {submission.category}</p>
                )}
                {submission.message && (
                  <p className="text-sm line-clamp-2">{submission.message}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.form_type} from {selectedSubmission?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p>{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>
                    <a href={`mailto:${selectedSubmission.email}`} className="text-crown-gold hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p>
                      <a href={`tel:${selectedSubmission.phone}`} className="text-crown-gold hover:underline">
                        {selectedSubmission.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Submitted</label>
                  <p>{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Subject & Category */}
              {selectedSubmission.subject && (
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <p>{selectedSubmission.subject}</p>
                </div>
              )}
              {selectedSubmission.category && (
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p>{selectedSubmission.category}</p>
                </div>
              )}

              {/* Message */}
              {selectedSubmission.message && (
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <p className="whitespace-pre-wrap bg-muted p-4 rounded-md">{selectedSubmission.message}</p>
                </div>
              )}

              {/* Additional Data */}
              {selectedSubmission.form_data && Object.keys(selectedSubmission.form_data).length > 0 && (
                <div>
                  <label className="text-sm font-medium">Additional Information</label>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedSubmission.form_data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) => updateStatus(selectedSubmission.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium block mb-2">Admin Notes</label>
                <Textarea
                  defaultValue={selectedSubmission.notes || ''}
                  placeholder="Add internal notes about this submission..."
                  rows={4}
                  onBlur={(e) => updateNotes(selectedSubmission.id, e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedSubmission) {
                  navigator.clipboard.writeText(selectedSubmission.email).then(() => {
                    toast({
                      title: "Email copied",
                      description: `${selectedSubmission.email} has been copied to your clipboard`,
                    });
                  });
                }
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Email
            </Button>
            <Button onClick={() => {
              if (selectedSubmission) {
                const subject = encodeURIComponent(`Re: ${selectedSubmission.subject || selectedSubmission.form_type || 'Your message'}`);
                const body = encodeURIComponent(`\n\n---\nOriginal message from ${selectedSubmission.name} (${new Date(selectedSubmission.created_at).toLocaleString()}):\n\n${selectedSubmission.message || ''}`);
                const mailtoLink = `mailto:${selectedSubmission.email}?subject=${subject}&body=${body}`;

                try {
                  window.location.href = mailtoLink;
                } catch (error) {
                  // Fallback: copy email to clipboard
                  navigator.clipboard.writeText(selectedSubmission.email).then(() => {
                    toast({
                      title: "Email copied to clipboard",
                      description: `Couldn't open email client. ${selectedSubmission.email} has been copied instead.`,
                    });
                  }).catch(() => {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to open email client",
                    });
                  });
                }
              }
            }}>
              <Mail className="h-4 w-4 mr-2" />
              Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission?</DialogTitle>
            <DialogDescription>
              This will remove the submission from the database only. The data will remain in Google Sheets.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteDialogOpen(false);
              setSubmissionToDelete(null);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (submissionToDelete) {
                  deleteSubmission(submissionToDelete);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormSubmissions;
