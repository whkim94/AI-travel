const PLACEHOLDER_IMAGE = '/assets/images/placeholder-image.jpg';

async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType != null && contentType.startsWith('image/');
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
}

export async function searchImage(location: string): Promise<string> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.error('Google Search API key or Search Engine ID is missing');
    return PLACEHOLDER_IMAGE;
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(location)}&searchType=image&num=5&imgType=photo`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Daily limit reached');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const validImages = await Promise.all(
        data.items.map(async (item) => ({
          url: item.link,
          isValid: await isValidImageUrl(item.link),
        }))
      );

      const firstValidImage = validImages.find((img) => img.isValid);
      if (firstValidImage) {
        return firstValidImage.url;
      }
    }

    console.log('No valid image found for location:', location);
    return PLACEHOLDER_IMAGE;
  } catch (error) {
    console.error('Error searching for image:', error);
    if (error.message === 'Daily limit reached') {
      throw error; // Re-throw this specific error to be handled in the API route
    }
    return PLACEHOLDER_IMAGE;
  }
}
