'use client';

import { Card, CardContent } from '@/components/ui/card';
import DestinationCard from './destination-card';

type Destination = {
  name: string;
  description: string;
  imageHint: string;
};

type TopDestinationsProps = {
  destinations: Destination[];
};

export default function TopDestinations({ destinations }: TopDestinationsProps) {
  if (!destinations || destinations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No destinations were generated. Please try refining your search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination, index) => (
        <DestinationCard key={index} destination={destination} />
      ))}
    </div>
  );
}
