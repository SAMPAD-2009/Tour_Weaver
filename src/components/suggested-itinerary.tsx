'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

type ItineraryDay = {
  day: number;
  activities: string;
};

type SuggestedItineraryProps = {
  itinerary: ItineraryDay[];
};

export default function SuggestedItinerary({ itinerary }: SuggestedItineraryProps) {
    if (!itinerary || itinerary.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p>No itinerary was generated. Please try refining your search.</p>
                </CardContent>
            </Card>
        );
    }

  return (
    <Card>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {itinerary.map((day, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-headline text-xl">
                Day {day.day}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground whitespace-pre-line">
                {day.activities}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
