export const generateItineraryPrompt = (mood: string, location: string) => `
Given a traveler in ${location} who is feeling ${mood}, suggest a detailed itinerary for a day. Include 5 specific activities that would be suitable for this mood and location. Consider the variety of activities, energy levels associated with this mood, and provide specific location information.

Also, provide a color code (in hexadecimal format) that best represents the mood "${mood}". Choose a color that aligns with the emotional state and energy level associated with this mood.

Format the response STRICTLY as a valid JSON object with the following structure:
{
  "colorCode": "#RRGGBB",
  "activities": [
    {
      "activity": "Description of the activity",
      "location": {
        "name": "Name of the location",
        "address": "Address of the location"
      },
      "imageDescription": "A brief, specific description of an image that would represent this activity or location",
      "additionalInfo": {
        "cost": "Cost information",
        "duration": "Estimated duration",
        "tips": "Relevant tips for the activity"
      }
    },
    // ... (4 more similar objects for a total of 5 activities)
  ]
}

Ensure that the color code is a valid hexadecimal color code, and that there are exactly 5 activities in the array. Do not include any explanation or additional text outside of the JSON object.
`;
