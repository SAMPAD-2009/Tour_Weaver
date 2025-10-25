'use client';

import { useState } from 'react';
import { Wind } from 'lucide-react';

import type { TourItineraryInput, TourItineraryOutput } from '@/ai/flows/generate-tour-itinerary';
import { useToast } from '@/hooks/use-toast';
import { getItinerary } from '@/app/actions';
import TripPlannerForm from '@/components/trip-planner-form';
import ItineraryDisplay from '@/components/itinerary-display';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function Home() {
  const [itinerary, setItinerary] = useState<TourItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateItinerary = async (data: TourItineraryInput) => {
    setIsLoading(true);
    setItinerary(null);
    const result = await getItinerary(data);
    setIsLoading(false);

    if (result.success && result.data) {
      setItinerary(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Itinerary',
        description: result.error || 'An unknown error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-8 border-b border-border/50">
        <div className="container mx-auto flex items-center gap-2">
           <Wind className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold font-headline text-foreground">
            Tour Weaver
          </h2>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <section className="text-center mb-10 md:mb-16">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            Weave Your Perfect Journey
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Let our AI assistant craft a personalized travel itinerary just for you. Discover destinations, activities, and the best hotels for your next adventure.
          </p>
        </section>

        <div className="max-w-4xl mx-auto">
          <TripPlannerForm onSubmit={handleGenerateItinerary} isLoading={isLoading} />
        </div>

        <div className="mt-12 md:mt-16">
          {isLoading && <LoadingSpinner />}
          {itinerary && <ItineraryDisplay itinerary={itinerary} />}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>HRH lord Samp2009</p>
      </footer>
    </div>
  );
}
