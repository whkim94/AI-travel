const PLACEHOLDER_IMAGE = '/assets/images/placeholder-image.jpg';

async function isValidImageUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType != null && contentType.startsWith('image/') ? url : null;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return null;
  }
}

export async function searchImage(location: string): Promise<string> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.error('Google Search API key or Search Engine ID is missing');
    return PLACEHOLDER_IMAGE;
  }

  const query = `${location}`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const validImagePromises = data.items.map((item) => isValidImageUrl(item.link));
      const validImage = await Promise.any(validImagePromises);

      if (validImage) {
        return validImage;
      }
    }

    console.log('No valid image found for location:', location);
    return PLACEHOLDER_IMAGE;
  } catch (error) {
    console.error('Error searching for image:', error);
    return PLACEHOLDER_IMAGE;
  }
}
