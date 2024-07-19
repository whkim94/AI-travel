interface ItineraryActivity {
  activity: string;
  location: {
    name: string;
    address: string;
  };
  imageDescription: string;
  imageUrl?: string;
  additionalInfo: {
    cost?: string;
    duration?: string;
    tips?: string;
    [key: string]: string | undefined;
  };
}

interface Itinerary {
  morning: ItineraryActivity;
  afternoon: ItineraryActivity;
  evening: ItineraryActivity;
}

export function parseItinerary(text: string): Itinerary {
  let itinerary: Itinerary;
  try {
    itinerary = JSON.parse(text);
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
    // If parsing fails, attempt to extract JSON-like structure
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        itinerary = JSON.parse(jsonMatch[0]);
      } catch (secondParseError) {
        console.error('Error parsing extracted JSON:', secondParseError);
        throw new Error('Failed to parse itinerary data');
      }
    } else {
      throw new Error('Failed to extract itinerary data');
    }
  }

  // Validate the itinerary structure
  if (
    !itinerary ||
    typeof itinerary !== 'object' ||
    !itinerary.morning ||
    !itinerary.afternoon ||
    !itinerary.evening
  ) {
    throw new Error('Invalid itinerary structure');
  }

  return itinerary;
}

export type { Itinerary, ItineraryActivity };
