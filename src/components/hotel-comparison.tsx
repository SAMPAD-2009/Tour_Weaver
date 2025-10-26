'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Building2, Users, BadgePercent, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

type Hotel = {
  hotel_name: string;
  hotel_class: string | null;
  review_rating: number;
  review_count?: number | null;
  deal_info: string | null;
  bookingUrl: string;
};

type HotelComparisonProps = {
  hotelData: {
    hotels: Hotel[];
  }
};

const StarRating = ({ rating, maxRating = 5, className }: { rating: number; maxRating?: number; className?: string }) => {
  if (rating === null || rating === undefined) return null;
  const roundedRating = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < roundedRating
              ? "fill-accent text-accent"
              : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};


export default function HotelComparison({ hotelData }: HotelComparisonProps) {
  if (!hotelData || !hotelData.hotels || hotelData.hotels.length === 0) {
    return (
        <Card>
            <CardContent className="pt-6">
                <p>No hotels were found for the given criteria. Please try refining your search.</p>
            </CardContent>
        </Card>
    );
  }

  const { hotels } = hotelData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Hotel Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]"><Building2 className="inline-block mr-2 h-4 w-4" />Hotel</TableHead>
                <TableHead><Star className="inline-block mr-2 h-4 w-4" />Rating</TableHead>
                <TableHead><Users className="inline-block mr-2 h-4 w-4" />Reviews</TableHead>
                <TableHead><BadgePercent className="inline-block mr-2 h-4 w-4" />Deals</TableHead>
                <TableHead className="text-right">Book</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.filter(hotel => hotel).map((hotel, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{hotel.hotel_name}</span>
                        {hotel.hotel_class && <span className="text-xs text-muted-foreground">{hotel.hotel_class}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={hotel.review_rating} />
                  </TableCell>
                  <TableCell>{hotel.review_count?.toLocaleString() ?? 'N/A'}</TableCell>
                  <TableCell>
                    {hotel.deal_info ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Badge role="button" variant="secondary" className="mt-1 bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20">
                            <BadgePercent className="h-3 w-3 mr-1" />
                            View Deal
                          </Badge>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Special Deal Information</DialogTitle>
                            <DialogDescription className="pt-4 text-base">
                              {hotel.deal_info}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                        Book Now
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
