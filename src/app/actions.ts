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

export async function getUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error("Unsplash API key is not configured.");
    return null;
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return null; // No image found
    }
  } catch (error) {
    console.error("Failed to fetch image from Unsplash:", error);
    return null;
  }
}
