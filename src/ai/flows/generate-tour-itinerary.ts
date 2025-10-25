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

Give the output in JSON format with the following schema:

{
  "items": [
    {
      "title": "Top Destinations",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "description"
        ]
      }
    },
    {
      "title": "Suggested Itinerary",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day": {
            "type": "integer",
            "description": "The day number of the itinerary"
          },
          "activities": {
            "type": "string"
          }
        },
        "required": [
          "day",
          "activities"
        ]
      }
    },
    {
      "title": "Hotel Comparison",
      "type": "object",
      "properties": {
        "search_parameters": {
          "type": "object",
          "properties": {
            "check_in_date": {
              "type": "string",
              "format": "date"
            },
            "length_of_stay": {
              "type": "integer"
            },
            "adults": {
              "type": "integer"
            },
            "currency": {
              "type": "string",
              "const": "INR"
            },
            "min_user_rating": {
              "type": "number",
              "description": "Corresponds to the 'rating' requested"
            }
          },
          "required": [
            "check_in_date",
            "length_of_stay",
            "adults",
            "currency",
            "min_user_rating"
          ]
        },
        "hotels": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "hotel_name": {
                "type": "string"
              },
              "hotel_class": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "review_rating": {
                "type": "number"
              },
              "review_count": {
                "type": "integer"
              },
              "total_stay_price_inr": {
                "type": "number"
              },
              "deal_info": {
                "type": [
                  "string",
                  "null"
                ]
              }
            },
            "required": [
              "hotel_name",
              "review_rating",
              "review_count",
              "total_stay_price_inr"
            ]
          }
        }
      },
      "required": [
        "search_parameters",
        "hotels"
      ]
    }
  ],
  "minItems": 3,
  "maxItems": 3
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
