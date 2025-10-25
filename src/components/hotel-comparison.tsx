'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Building2, Users, IndianRupee, BadgePercent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Hotel = {
  hotel_name: string;
  hotel_class: string | null;
  review_rating: number;
  review_count?: number;
  total_stay_price_inr?: number;
  deal_info: string | null;
};

type HotelData = {
  search_parameters: {
    check_in_date: string;
    length_of_stay: number;
    adults: number;
    currency: string;
    min_user_rating: number;
  };
  hotels: Hotel[];
};

type HotelComparisonProps = {
  hotelData: HotelData;
};

const StarRating = ({ rating, maxRating = 5, className }: { rating: number; maxRating?: number; className?: string }) => {
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

  const { search_parameters, hotels } = hotelData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Hotel Options</CardTitle>
        <CardDescription>
          Based on your search for a {search_parameters.length_of_stay}-day stay for {search_parameters.adults} adult(s) from {search_parameters.check_in_date}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]"><Building2 className="inline-block mr-2 h-4 w-4" />Hotel</TableHead>
                <TableHead><Star className="inline-block mr-2 h-4 w-4" />Rating</TableHead>
                <TableHead><Users className="inline-block mr-2 h-4 w-4" />Reviews</TableHead>
                <TableHead className="text-right"><IndianRupee className="inline-block mr-2 h-4 w-4" />Total Price</TableHead>
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
                    {hotel.review_rating != null && <StarRating rating={hotel.review_rating} />}
                  </TableCell>
                  <TableCell>{hotel.review_count?.toLocaleString() ?? 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      {hotel.total_stay_price_inr != null ? (
                        <span className="font-bold">₹{hotel.total_stay_price_inr.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                      {hotel.deal_info && (
                          <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                     <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-primary/20 cursor-help">
                                        <BadgePercent className="h-3 w-3 mr-1"/>
                                        Deal
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{hotel.deal_info}</p>
                                </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      )}
                    </div>
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
