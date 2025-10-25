'use server';
import { generateTourItinerary, type TourItineraryInput } from '@/ai/flows/generate-tour-itinerary';

export async function getItinerary(input: TourItineraryInput) {
  try {
    const itinerary = await generateTourItinerary(input);
    if (!itinerary || !itinerary.items || itinerary.items.length < 3) {
      throw new Error("AI failed to return a valid itinerary structure.");
    }
    return { success: true, data: itinerary };
  } catch (error) {
    console.error("Error in getItinerary server action:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to generate itinerary. ${errorMessage}` };
  }
}
