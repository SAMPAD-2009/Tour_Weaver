'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plane, Users, Star, CalendarDays } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import type { TourItineraryInput } from '@/ai/flows/generate-tour-itinerary';


const formSchema = z.object({
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  noOfDays: z.coerce.number().min(1, { message: 'Must be at least 1 day.' }).max(30, { message: 'Cannot exceed 30 days.' }),
  checkInDate: z.date({ required_error: 'A check-in date is required.' }),
  adults: z.coerce.number().min(1, { message: 'Must be at least 1 adult.' }),
  minUserRating: z.number().min(0).max(5),
});

type TripPlannerFormProps = {
  onSubmit: (data: TourItineraryInput) => void;
  isLoading: boolean;
};

export default function TripPlannerForm({ onSubmit, isLoading }: TripPlannerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      noOfDays: 7,
      adults: 2,
      minUserRating: 4,
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues: TourItineraryInput = {
      ...values,
      checkInDate: format(values.checkInDate, 'yyyy-MM-dd'),
    };
    onSubmit(formattedValues);
  }

  return (
    <Card className="border-border/80 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., Paris, France" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="noOfDays"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Days</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="e.g., 7" {...field} className="pl-9" />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adults"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Adults</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="e.g., 2" {...field} className="pl-9" />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="minUserRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Hotel Rating: <span className="font-bold text-primary">{field.value.toFixed(1)}</span> / 5</FormLabel>
                  <FormControl>
                     <div className="flex items-center gap-4">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <Slider
                            min={0}
                            max={5}
                            step={0.5}
                            onValueChange={(value) => field.onChange(value[0])}
                            defaultValue={[field.value]}
                            className="w-full"
                        />
                     </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Weaving Your Itinerary...
                </>
              ) : (
                'Generate Itinerary'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
