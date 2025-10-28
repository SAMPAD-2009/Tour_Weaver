'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HotelSchema = z.object({
  hotel_name: z.string(),
  hotel_class: z.string().nullable(),
  review_rating: z.number(),
  review_count: z.number().optional().nullable(),
  deal_info: z.string().nullable(),
  bookingUrl: z.string().url(),
});

export const findHotels = ai.defineTool(
  {
    name: 'findHotels',
    description: 'Find hotels in a given location with a minimum rating.',
    inputSchema: z.object({
      location: z.string().describe('The city and country to search for hotels in.'),
      minUserRating: z.number().describe('The minimum user rating for the hotel (1-5).'),
    }),
    outputSchema: z.object({
      hotels: z.array(HotelSchema),
    }),
  },
  async (input) => {
    console.log(`Searching for hotels in ${input.location} with rating >= ${input.minUserRating}`);
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("Google Places API key is not configured.");
    }

    const query = `hotels in ${input.location}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&minprice=1&maxprice=4&key=${apiKey}&type=hotel`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Google Places API error: ${response.statusText}`, errorBody);
        throw new Error(`Failed to fetch hotels: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Places API returned an error:', data.status, data.error_message);
        throw new Error(`Google Places API error: ${data.status}`);
      }

      if (!data.results || data.results.length === 0) {
        return { hotels: [] };
      }

      // Filter and map results to our Hotel schema
      const hotels = data.results
        .filter((place: any) => place.rating && place.rating >= input.minUserRating)
        .slice(0, 15) // Limit to 15 hotels
        .map((place: any) => ({
          hotel_name: place.name,
          hotel_class: null, // Places API doesn't provide a direct hotel class/star rating.
          review_rating: place.rating,
          review_count: place.user_ratings_total,
          deal_info: null, // No deal info from this API
          // Construct a Google search URL as a booking link
          bookingUrl: `https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + place.formatted_address)}`,
        }));

      return { hotels };
    } catch (error) {
      console.error("Error fetching from Google Places API:", error);
      throw new Error("An unexpected error occurred while fetching hotel data.");
    }
  }
);
