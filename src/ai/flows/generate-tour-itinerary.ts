'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a tour itinerary based on user input.
 *
 * The flow takes location, date range, number of adults, and minimum hotel rating as input
 * and returns a personalized tour itinerary with destinations, activities, and hotel options.
 *
 * @exports generateTourItinerary - The main function to trigger the tour itinerary generation flow.
 * @exports TourItineraryInput - The input type for the generateTourItinerary function.
 * @exports TourItineraryOutput - The output type for the generateTourItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TourItineraryInputSchema = z.object({
  location: z.string().describe('The destination for the trip.'),
  noOfDays: z.number().describe('The number of days for the trip.'),
  checkInDate: z.string().describe('The check-in date for the trip (YYYY-MM-DD).'),
  adults: z.number().describe('The number of adults for the hotel booking.'),
  minUserRating: z.number().describe('The minimum user rating for hotels (0-5).'),
});
export type TourItineraryInput = z.infer<typeof TourItineraryInputSchema>;

const DestinationSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const ItineraryDaySchema = z.object({
  day: z.number(),
  activities: z.string(),
});

const HotelSchema = z.object({
  hotel_name: z.string(),
  hotel_class: z.string().nullable(),
  review_rating: z.number(),
  review_count: z.number().optional().nullable(),
  total_stay_price_inr: z.number().optional().nullable(),
  deal_info: z.string().nullable(),
});

const TourItineraryOutputSchema = z.object({
  destinations: z.array(DestinationSchema),
  itinerary: z.array(ItineraryDaySchema),
  hotels: z.array(HotelSchema),
});

export type TourItineraryOutput = z.infer<typeof TourItineraryOutputSchema>;

export async function generateTourItinerary(input: TourItineraryInput): Promise<TourItineraryOutput> {
  return generateTourItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tourItineraryPrompt',
  input: {schema: TourItineraryInputSchema},
  output: {schema: TourItineraryOutputSchema},
  prompt: `You are an expert travel agent. Plan a trip to {{location}} for {{noOfDays}} days for {{adults}} adults, starting on {{checkInDate}}. The user requires hotels with a minimum rating of {{minUserRating}}.

  Generate a response with the following structure:
  - destinations: An array of 3 to 5 top destinations to visit in {{location}}. Each destination must have a name and a description.
  - itinerary: A day-by-day plan of activities for {{noOfDays}} days.
  - hotels: A list of 3-5 recommended hotels that meet the criteria. Provide the hotel name, star rating (hotel_class), and review rating. You must calculate and include the 'total_stay_price_inr' based on the trip duration of {{noOfDays}} days and {{adults}} adults.

You must provide the output in a valid JSON format that strictly follows the defined output schema. Do not add any commentary before or after the JSON.
`,
});

const generateTourItineraryFlow = ai.defineFlow(
  {
    name: 'generateTourItineraryFlow',
    inputSchema: TourItineraryInputSchema,
    outputSchema: TourItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('An unexpected response was received from the server.');
    }
    return output;
  }
);
