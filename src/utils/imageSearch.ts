export async function searchImage(query: string, location: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query + ' ' + location)}&searchType=image&num=1&imgSize=large&imgType=photo`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image search response:', data); // Log the response for debugging

    if (data.items && data.items.length > 0 && data.items[0].link) {
      return data.items[0].link;
    } else {
      console.error('No image found in the search results');
      return '/placeholder-image.jpg'; // Return a placeholder image
    }
  } catch (error) {
    console.error('Error searching for image:', error);
    return '/placeholder-image.jpg'; // Return a placeholder image on error
  }
}
