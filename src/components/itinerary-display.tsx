'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopDestinations from './top-destinations';
import SuggestedItinerary from './suggested-itinerary';
import HotelComparison from './hotel-comparison';
import type { TourItineraryOutput } from '@/ai/flows/generate-tour-itinerary';

type ItineraryDisplayProps = {
  itinerary: TourItineraryOutput;
};

type Destination = { name: string; description: string };
type ItineraryDay = { day: number; activities: string };
type HotelComparisonData = {
  search_parameters: any;
  hotels: any[];
};

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const destinations = itinerary.items.find(item => item.title === 'Top Destinations')?.items as Destination[] || [];
  const suggestedItinerary = itinerary.items.find(item => item.title === 'Suggested Itinerary')?.items as ItineraryDay[] || [];
  const hotelComparison = itinerary.items.find(item => item.title === 'Hotel Comparison');
  
  // The AI sometimes nests the data one level deeper.
  const hotelData = hotelComparison?.items as HotelComparisonData | undefined;

  return (
    <div className="w-full animate-in fade-in-50 duration-500">
      <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">Your Custom Itinerary</h2>
      <Tabs defaultValue="destinations" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="destinations">Top Destinations</TabsTrigger>
          <TabsTrigger value="itinerary">Suggested Itinerary</TabsTrigger>
          <TabsTrigger value="hotels">Hotel Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="destinations">
          <TopDestinations destinations={destinations} />
        </TabsContent>
        <TabsContent value="itinerary">
          <SuggestedItinerary itinerary={suggestedItinerary} />
        </TabsContent>
        <TabsContent value="hotels">
            {hotelData && hotelData.hotels ? <HotelComparison hotelData={hotelData} /> : <p>No hotel data available.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
