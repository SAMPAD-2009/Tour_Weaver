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

const HotelSchema = z.object({
  hotel_name: z.string(),
  hotel_class: z.string().nullable(),
  review_rating: z.number(),
  review_count: z.number().optional(),
  total_stay_price_inr: z.number().optional(),
  deal_info: z.string().nullable(),
});

const HotelComparisonSchema = z.object({
  search_parameters: z.object({
    check_in_date: z.string(),
    length_of_stay: z.number(),
    adults: z.number(),
    currency: z.string(),
    min_user_rating: z.number(),
  }),
  hotels: z.array(HotelSchema),
});

const TourItineraryOutputSchema = z.object({
  destinations: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  itinerary: z.array(
    z.object({
      day: z.number(),
      activities: z.string(),
    })
  ),
  hotels: HotelComparisonSchema,
});

export type TourItineraryOutput = z.infer<typeof TourItineraryOutputSchema>;

export async function generateTourItinerary(input: TourItineraryInput): Promise<TourItineraryOutput> {
  return generateTourItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tourItineraryPrompt',
  input: {schema: TourItineraryInputSchema},
  output: {schema: TourItineraryOutputSchema},
  prompt: `You are an expert travel agent. Your task is to plan a trip to {{location}} for {{noOfDays}} days for {{adults}} adults, starting on {{checkInDate}}. The user requires hotels with a minimum rating of {{minUserRating}}.

You must provide the output in a valid JSON format that strictly follows this structure:
{
  "destinations": [ { "name": "...", "description": "..." }, ... ],
  "itinerary": [ { "day": 1, "activities": "..." }, ... ],
  "hotels": {
    "search_parameters": { "check_in_date": "{{checkInDate}}", "length_of_stay": {{noOfDays}}, "adults": {{adults}}, "currency": "INR", "min_user_rating": {{minUserRating}} },
    "hotels": [ { "hotel_name": "...", "hotel_class": "...", "review_rating": 4.5, "review_count": 123, "total_stay_price_inr": 15000, "deal_info": "..." }, ... ]
  }
}

Do not add any commentary before or after the JSON. The entire response must be only the JSON object.
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
