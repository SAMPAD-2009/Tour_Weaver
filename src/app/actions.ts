'use server';
import { generateTourItinerary, type TourItineraryInput, type TourItineraryOutput } from '@/ai/flows/generate-tour-itinerary';

export async function getItinerary(input: TourItineraryInput): Promise<{ success: boolean; data?: TourItineraryOutput; error?: string; }> {
  try {
    const itinerary = await generateTourItinerary(input);
    // Basic validation to ensure the AI returned the core objects
    if (!itinerary || !itinerary.destinations || !itinerary.itinerary || !itinerary.hotels) {
      throw new Error("AI failed to return a valid itinerary structure.");
    }
    return { success: true, data: itinerary };
  } catch (error) {
    console.error("Error in getItinerary server action:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to generate itinerary. ${errorMessage}` };
  }
}
