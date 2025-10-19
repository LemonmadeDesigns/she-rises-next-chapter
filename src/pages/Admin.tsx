import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Mail, Phone, User, MessageSquare, CheckCircle, XCircle, AlertCircle, Trash2, Plus, CalendarDays } from 'lucide-react';
import EventManagement from '@/components/admin/EventManagement';

interface VisitRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

interface User {
  id: string;
  email?: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingNotes, setUpdatingNotes] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define loadVisitRequests function
  const loadVisitRequests = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('visit_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Database Error",
          description: error.message || "Failed to load visit requests.",
          variant: "destructive"
        });
        return;
      }

      setVisitRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load visit requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Check authentication and admin status
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          toast({
            title: "Authentication Error",
            description: sessionError.message,
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        if (!session?.user) {
          navigate('/auth');
          return;
        }

        // Try to load visit requests - backend RLS will enforce authorization
        setUser(session.user);
        await loadVisitRequests();
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate, toast, loadVisitRequests]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(id);
    try {
      const { error } = await supabase
        .from('visit_requests')
        .update({ status })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive"
        });
        return;
      }

      setVisitRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status } : request
        )
      );

      toast({
        title: "Status Updated",
        description: `Visit request marked as ${status}.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const updateAdminNotes = async (id: string, notes: string) => {
    setUpdatingNotes(id);
    try {
      const { error } = await supabase
        .from('visit_requests')
        .update({ admin_notes: notes })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update notes.",
          variant: "destructive"
        });
        return;
      }

      setVisitRequests(prev =>
        prev.map(request =>
          request.id === id ? { ...request, admin_notes: notes } : request
        )
      );

      toast({
        title: "Notes Updated",
        description: "Admin notes saved successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notes.",
        variant: "destructive"
      });
    } finally {
      setUpdatingNotes(null);
    }
  };

  const deleteVisitRequest = async (id: string) => {
    setDeletingRequest(id);
    try {
      const { error } = await supabase
        .from('visit_requests')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete visit request.",
          variant: "destructive"
        });
        return;
      }

      setVisitRequests(prev => prev.filter(request => request.id !== id));
      setDeleteConfirmId(null);

      toast({
        title: "Visit Request Deleted",
        description: "The visit request has been permanently deleted.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete visit request.",
        variant: "destructive"
      });
    } finally {
      setDeletingRequest(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-royal-plum mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage visit requests, events, and scheduling
          </p>
        </div>

        <Tabs defaultValue="visit-requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="visit-requests" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Visit Requests
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Events Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visit-requests" className="mt-6">
            <div className="grid gap-6">
          {visitRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No visit requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            visitRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-serif text-royal-plum">
                      {request.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submitted {new Date(request.created_at).toLocaleDateString()} at{' '}
                    {new Date(request.created_at).toLocaleTimeString()}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-crown-gold" />
                        <a href={`mailto:${request.email}`} className="text-royal-plum hover:underline">
                          {request.email}
                        </a>
                      </div>
                      
                      {request.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-crown-gold" />
                          <a href={`tel:${request.phone}`} className="text-royal-plum hover:underline">
                            {request.phone}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-crown-gold" />
                        <span>{new Date(request.preferred_date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-crown-gold" />
                        <span>{request.preferred_time}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {request.message && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <MessageSquare className="h-4 w-4 text-crown-gold" />
                            Message
                          </div>
                          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                            {request.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-crown-gold" />
                      Admin Notes
                    </div>
                    <Textarea
                      placeholder="Add notes about this visit request..."
                      defaultValue={request.admin_notes || ''}
                      onBlur={(e) => {
                        if (e.target.value !== (request.admin_notes || '')) {
                          updateAdminNotes(request.id, e.target.value);
                        }
                      }}
                      disabled={updatingNotes === request.id}
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(request.id, 'confirmed')}
                      disabled={updatingStatus === request.id || request.status === 'confirmed'}
                      className="text-green-700 border-green-200 hover:bg-green-50"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(request.id, 'completed')}
                      disabled={updatingStatus === request.id || request.status === 'completed'}
                      className="text-blue-700 border-blue-200 hover:bg-blue-50"
                    >
                      Mark Complete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(request.id, 'cancelled')}
                      disabled={updatingStatus === request.id || request.status === 'cancelled'}
                      className="text-red-700 border-red-200 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                    <div className="flex-1" />
                    {deleteConfirmId === request.id ? (
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteVisitRequest(request.id)}
                          disabled={deletingRequest === request.id}
                        >
                          {deletingRequest === request.id ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Keep
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmId(request.id)}
                        className="text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}