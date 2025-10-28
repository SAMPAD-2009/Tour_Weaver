'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUnsplashImage } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

type Destination = {
  name: string;
  description: string;
  imageHint: string;
};

type DestinationCardProps = {
  destination: Destination;
};

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      setIsLoading(true);
      const url = await getUnsplashImage(destination.imageHint);
      setImageUrl(url);
      setIsLoading(false);
    }

    if (destination.imageHint) {
      fetchImage();
    } else {
        setIsLoading(false);
    }
  }, [destination.imageHint]);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={destination.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image found</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        <CardTitle className="font-headline text-2xl mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {destination.name}
        </CardTitle>
        <p className="text-muted-foreground">{destination.description}</p>
      </CardContent>
    </Card>
  );
}
