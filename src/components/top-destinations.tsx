'use client';

import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Destination = {
  name: string;
  description: string;
  imageUrl: string;
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
      {destinations.map((destination, index) => {
        return (
          <Card key={index} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={destination.name}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline text-2xl mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {destination.name}
              </CardTitle>
              <p className="text-muted-foreground">{destination.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
