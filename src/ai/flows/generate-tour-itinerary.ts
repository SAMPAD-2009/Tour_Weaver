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

const TourItineraryOutputSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      type: z.string(),
      items: z.any(),
    })
  ),
});
export type TourItineraryOutput = z.infer<typeof TourItineraryOutputSchema>;

export async function generateTourItinerary(input: TourItineraryInput): Promise<TourItineraryOutput> {
  return generateTourItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tourItineraryPrompt',
  input: {schema: TourItineraryInputSchema},
  output: {schema: TourItineraryOutputSchema},
  prompt: `Plan a trip to {{location}} for {{noOfDays}} days. Check-in date: {{checkInDate}}, {{adults}} adults, minimum user rating: {{minUserRating}}.

You must provide the output in JSON format. Do not add any commentary before or after the JSON.
The JSON should have the following schema:

{
  "items": [
    {
      "title": "Top Destinations",
      "type": "array",
      "items": [
        {
          "name": "string",
          "description": "string"
        }
      ]
    },
    {
      "title": "Suggested Itinerary",
      "type": "array",
      "items": [
        {
          "day": "integer",
          "activities": "string"
        }
      ]
    },
    {
      "title": "Hotel Comparison",
      "type": "object",
      "items": {
        "search_parameters": {
          "check_in_date": "string (format: date)",
          "length_of_stay": "integer",
          "adults": "integer",
          "currency": "string (const: INR)",
          "min_user_rating": "number"
        },
        "hotels": [
          {
            "hotel_name": "string",
            "hotel_class": "string | null",
            "review_rating": "number",
            "review_count": "integer",
            "total_stay_price_inr": "number",
            "deal_info": "string | null"
          }
        ]
      }
    }
  ]
}
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
    return output!;
  }
);
