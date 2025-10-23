import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const visitRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().optional(),
  preferred_date: z.string().min(1, 'Preferred date is required'),
  preferred_time: z.string().min(1, 'Preferred time is required'),
  message: z.string().trim().optional().refine(
    (val) => !val || val.length <= 1000,
    'Message must be less than 1000 characters'
  )
});

interface VisitSchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VisitSchedulingModal({ open, onOpenChange }: VisitSchedulingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM', 
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = visitRequestSchema.parse(formData);
      
      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke("submit-visit-request", {
        body: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          preferred_date: validatedData.preferred_date,
          preferred_time: validatedData.preferred_time,
          message: validatedData.message || null
        }
      });

      if (emailError) throw emailError;

      // Also save to database
      const { error: dbError } = await supabase
        .from('visit_requests')
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          preferred_date: validatedData.preferred_date,
          preferred_time: validatedData.preferred_time,
          message: validatedData.message || null
        });

      if (dbError) console.error('Database insert error:', dbError);

      toast({
        title: "Request Submitted!",
        description: "We'll contact you soon to confirm your visit details.",
        variant: "default"
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        preferred_date: '',
        preferred_time: '',
        message: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive"
        });
      } else {
        console.error('Error submitting visit request:', error);
        toast({
          title: "Error",
          description: "Failed to submit visit request. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-royal-plum font-serif text-xl">
            Schedule a Visit
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                required
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                maxLength={255}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_date">Preferred Date *</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                min={today}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferred_time">Preferred Time *</Label>
              <Select value={formData.preferred_time} onValueChange={(value) => handleInputChange('preferred_time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Let us know if you have any specific questions or special requirements..."
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-crown-gold hover:bg-crown-gold/90 text-royal-plum"
            >
              {isSubmitting ? 'Submitting...' : 'Schedule Visit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}