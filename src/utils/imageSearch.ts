const PLACEHOLDER_IMAGE = '/assets/images/placeholder-image.jpg';

export async function searchImage(location: string): Promise<string> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.error('Google Search API key or Search Engine ID is missing');
    return PLACEHOLDER_IMAGE;
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(location)}&searchType=image&num=1&imgType=photo`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Daily limit reached');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.items[0]?.link) {
      return data.items[0].link;
    }

    console.log('No image found for location:', location);
    return PLACEHOLDER_IMAGE;
  } catch (error) {
    console.error('Error searching for image:', error);
    if (error.message === 'Daily limit reached') {
      throw error; // Re-throw this specific error to be handled in the API route
    }
    return PLACEHOLDER_IMAGE;
  }
}
