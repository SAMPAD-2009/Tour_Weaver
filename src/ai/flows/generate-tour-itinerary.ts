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
  noOfDays: z.coerce.number().describe('The number of days for the trip.'),
  checkInDate: z.string().describe('The check-in date for the trip (YYYY-MM-DD).'),
  adults: z.coerce.number().describe('The number of adults for the hotel booking.'),
  minUserRating: z.number().describe('The minimum user rating for hotels (0-5).'),
});
export type TourItineraryInput = z.infer<typeof TourItineraryInputSchema>;

const DestinationSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
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
  prompt: `You are an expert travel agent. Your task is to create a personalized tour itinerary.

Input:
- Location: {{location}}
- Duration: {{noOfDays}} days
- Start Date: {{checkInDate}}
- Guests: {{adults}} adults
- Hotel Rating: Minimum {{minUserRating}} stars

Instructions:
1.  **Destinations**: Generate a list of top destinations to visit in {{location}}. For each destination, provide its name, a brief description, and a publicly accessible, high-quality image URL. You should source these images from Google Places or a similar service that provides stable, direct image links. Ensure the URLs are direct image links and are not prone to expiring.
2.  **Itinerary**: Create a day-by-day plan of activities for the entire duration of the trip ({{noOfDays}} days).
3.  **Hotels**: Recommend a list of hotels that meet the user's criteria (minimum {{minUserRating}}-star rating). For each hotel, provide the name, star rating (hotel_class), review score, number of reviews, and any special deals or information.

Output Format:
You MUST provide the output in a valid JSON format that strictly follows the defined output schema. Do not add any commentary before or after the JSON.
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
