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
  prompt: `You are an expert travel agent. Your task is to plan a trip to {{location}} for {{noOfDays}} days for {{adults}} adults, starting on {{checkInDate}}. The user requires hotels with a minimum rating of {{minUserRating}}.

You must provide the output in a valid JSON format, containing an 'items' array with three objects:
1.  A "Top Destinations" object.
2.  A "Suggested Itinerary" object.
3.  A "Hotel Comparison" object.

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
