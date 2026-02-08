import React, { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, Plus, Pencil, Trash2, Star, Users, Image as ImageIcon } from 'lucide-react';

const VALID_CATEGORIES = ['general', 'fundraising', 'wellness', 'employment', 'support', 'volunteer', 'education'] as const;
const VALID_TYPES = ['In-Person', 'Virtual', 'Hybrid'] as const;

const eventSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  category: z.enum(VALID_CATEGORIES, { errorMap: () => ({ message: 'Invalid category' }) }),
  type: z.enum(VALID_TYPES, { errorMap: () => ({ message: 'Invalid event type' }) }),
  date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().max(100, 'Time must be 100 characters or less').optional().or(z.literal('')),
  location: z.string().max(200, 'Location must be 200 characters or less').optional().or(z.literal('')),
  address: z.string().max(300, 'Address must be 300 characters or less').optional().or(z.literal('')),
  description: z.string().trim().min(1, 'Description is required').max(2000, 'Description must be 2000 characters or less'),
  image: z.string().max(500, 'Image URL must be 500 characters or less')
    .refine((val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
      message: 'Image must be a valid URL (http/https) or a relative path starting with /',
    })
    .optional()
    .or(z.literal('')),
  price: z.string().max(50, 'Price must be 50 characters or less').optional().or(z.literal('')),
  capacity: z.string().refine((val) => {
    if (!val) return true;
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 100000;
  }, { message: 'Capacity must be a number between 0 and 100,000' }),
  registered: z.string().refine((val) => {
    if (!val) return true;
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 100000;
  }, { message: 'Registered must be a number between 0 and 100,000' }),
  featured: z.boolean(),
  highlights: z.string().max(5000, 'Highlights must be 5000 characters or less').optional().or(z.literal('')),
});

interface Event {
  id: string;
  title: string;
  category: string;
  type: string;
  date: string;
  time: string | null;
  location: string | null;
  address: string | null;
  description: string;
  image: string | null;
  price: string | null;
  capacity: number | null;
  registered: number | null;
  featured: boolean | null;
  highlights: string[] | null;
  created_at: string;
  updated_at: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    type: 'In-Person',
    date: '',
    time: '',
    location: '',
    address: '',
    description: '',
    image: '',
    price: 'Free',
    capacity: '50',
    registered: '0',
    featured: false,
    highlights: ''
  });
  const { toast } = useToast();

  const loadEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        toast({
          title: "Error",
          description: "Failed to load events.",
          variant: "destructive"
        });
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Failed to load events.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'general',
      type: 'In-Person',
      date: '',
      time: '',
      location: '',
      address: '',
      description: '',
      image: '',
      price: 'Free',
      capacity: '50',
      registered: '0',
      featured: false,
      highlights: ''
    });
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod schema
    const validation = eventSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive"
      });
      return;
    }

    const validated = validation.data;

    try {
      const highlightsArray = validated.highlights
        ? validated.highlights.split('\n').map(h => h.trim()).filter(h => h !== '').slice(0, 50)
        : [];

      const eventData = {
        title: validated.title,
        category: validated.category,
        type: validated.type,
        date: validated.date,
        time: validated.time || null,
        location: validated.location || null,
        address: validated.address || null,
        description: validated.description,
        image: validated.image || null,
        price: validated.price || 'Free',
        capacity: Math.max(0, parseInt(validated.capacity) || 50),
        registered: Math.max(0, parseInt(validated.registered) || 0),
        featured: validated.featured,
        highlights: highlightsArray.length > 0 ? highlightsArray : null
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "Event Updated",
          description: "The event has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([{ ...eventData, id: crypto.randomUUID() }]);

        if (error) throw error;

        toast({
          title: "Event Created",
          description: "The event has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      category: event.category || 'general',
      type: event.type || 'In-Person',
      date: event.date,
      time: event.time || '',
      location: event.location || '',
      address: event.address || '',
      description: event.description,
      image: event.image || '',
      price: event.price || 'Free',
      capacity: event.capacity?.toString() || '50',
      registered: event.registered?.toString() || '0',
      featured: event.featured || false,
      highlights: event.highlights?.join('\n') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
      });

      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event.",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (event: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ featured: !event.featured })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: event.featured ? "Event Unfeatured" : "Event Featured",
        description: `The event has been ${event.featured ? 'removed from' : 'added to'} featured events.`,
      });

      loadEvents();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update event.",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fundraising: "bg-lotus-rose text-white",
      wellness: "bg-crown-gold text-royal-plum",
      employment: "bg-royal-plum text-white",
      support: "bg-sage-green text-white",
      volunteer: "bg-warm-cream text-royal-plum",
      education: "bg-muted text-muted-foreground",
      general: "bg-gray-200 text-gray-800"
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-royal-plum">Event Calendar Management</h2>
          <p className="text-muted-foreground">Create and manage events for the public calendar</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-royal-plum hover:bg-royal-plum/90"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Event Title * <span className="text-xs text-muted-foreground">(max 200 chars)</span></Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="fundraising">Fundraising</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="support">Support Groups</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    placeholder="e.g., 6:00 PM - 8:00 PM"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    maxLength={200}
                    placeholder="e.g., Community Center"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    maxLength={300}
                    placeholder="e.g., 123 Main St, City"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., Free, $25, $10-$50"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="registered">Currently Registered</Label>
                  <Input
                    id="registered"
                    type="number"
                    value={formData.registered}
                    onChange={(e) => handleInputChange('registered', e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="image">Image URL <span className="text-xs text-muted-foreground">(must start with / or https://)</span></Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    maxLength={500}
                    placeholder="https://... or /images/..."
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description * <span className="text-xs text-muted-foreground">(max 2000 chars)</span></Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    maxLength={2000}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="highlights">Highlights (one per line)</Label>
                  <Textarea
                    id="highlights"
                    value={formData.highlights}
                    onChange={(e) => handleInputChange('highlights', e.target.value)}
                    rows={4}
                    maxLength={5000}
                    placeholder="Enter each highlight on a new line (max 50 items)"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Event
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-royal-plum hover:bg-royal-plum/90">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No events yet. Create your first event!</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                      <Badge variant="outline">{event.type}</Badge>
                      {event.featured && (
                        <Badge className="bg-crown-gold text-royal-plum">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFeatured(event)}
                      className="text-crown-gold border-crown-gold hover:bg-crown-gold/10"
                    >
                      <Star className={`h-4 w-4 ${event.featured ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{event.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-crown-gold" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-crown-gold" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-crown-gold" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-crown-gold" />
                    <span>{event.registered || 0}/{event.capacity || 0} registered</span>
                  </div>
                </div>
                {event.image && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span className="truncate">{event.image}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EventManagement;
