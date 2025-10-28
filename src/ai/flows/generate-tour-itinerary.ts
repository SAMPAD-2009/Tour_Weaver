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
  budget: z.string().describe('The budget for the trip (e.g., "Budget", "Mid-Range", "Luxury").'),
});
export type TourItineraryInput = z.infer<typeof TourItineraryInputSchema>;

const DestinationSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageHint: z.string().describe("One or two descriptive keywords for the destination, including the location to ensure accuracy (e.g., 'Eiffel Tower Paris', 'Golden Gate Bridge San Francisco')."),
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
  bookingUrl: z.string().url().describe('A URL to a third-party hotel booking website (e.g., booking.com, expedia.com).'),
});

const TourItineraryOutputSchema = z.object({
  destinations: z.array(DestinationSchema),
  itinerary: z.array(ItineraryDaySchema),
  hotels: z.array(HotelSchema),
  packingList: z.array(z.string()).describe("A list of recommended items to pack for the trip."),
});

export type TourItineraryOutput = z.infer<typeof TourItineraryOutputSchema>;

export async function generateTourItinerary(input: TourItineraryInput): Promise<TourItineraryOutput> {
  return generateTourItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tourItineraryPrompt',
  input: {schema: TourItineraryInputSchema},
  output: {schema: TourItineraryOutputSchema},
  prompt: `You are an expert travel agent. Your task is to create a personalized tour itinerary, find hotels, and suggest a packing list.

Input:
- Location: {{location}}
- Duration: {{noOfDays}} days
- Start Date: {{checkInDate}}
- Guests: {{adults}} adults
- Hotel Rating: Minimum {{minUserRating}} stars
- Budget: {{budget}}

Instructions:
1.  **Destinations**: Generate a list of 7 to 15 top destinations to visit in {{location}}. For each destination, provide its name, a brief description, and a short hint for an image (imageHint). The hint should consist of one or two keywords and MUST include the location to ensure accuracy (e.g., 'St. Paul's Cathedral Kolkata', 'Eiffel Tower Paris').
2.  **Itinerary**: Create a day-by-day plan of activities for the entire duration of the trip ({{noOfDays}} days). Tailor the activities to the specified budget. For "Budget", suggest free activities like park visits or walking tours. For "Luxury", suggest premium experiences.
3.  **Hotels**: Recommend a list of hotels that meet the user's criteria (location: {{location}}, minimum {{minUserRating}}-star rating). The hotel recommendations MUST be appropriate for the selected **budget**.
4.  **Packing List**: Generate a recommended packing list. The list should be based on the destination's typical weather for the selected dates ({{checkInDate}} for {{noOfDays}} days) and the planned activities in the itinerary.

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
