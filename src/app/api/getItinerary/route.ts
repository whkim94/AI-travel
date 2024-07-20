import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { searchImage } from 'src/utils/imageSearch';
import { generateItineraryPrompt } from 'src/utils/itineraryPrompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const { GEMINI_MODEL_VERSION } = process.env;

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchItineraryFromGemini(prompt: string, retryCount = 0): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_VERSION });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`Error generating itinerary (attempt ${retryCount + 1}):`, error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY);
      return fetchItineraryFromGemini(prompt, retryCount + 1);
    }
    throw new Error('Failed to generate itinerary after multiple attempts');
  }
}

export async function POST(request: Request) {
  try {
    const { mood, location } = await request.json();

    if (!mood || typeof mood !== 'string' || !location || typeof location !== 'string') {
      return NextResponse.json({ error: 'Invalid mood or location provided' }, { status: 400 });
    }

    const prompt = generateItineraryPrompt(mood, location);
    const text = await fetchItineraryFromGemini(prompt);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Failed to parse itinerary data');
    }

    if (!data.colorCode || !Array.isArray(data.activities) || data.activities.length !== 5) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Fetch images for each activity based on its specific location
    for (let i = 0; i < data.activities.length; i++) {
      const activityLocation = data.activities[i].location.name;
      const imageUrl = await searchImage(activityLocation);
      data.activities[i].imageUrl = imageUrl;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
