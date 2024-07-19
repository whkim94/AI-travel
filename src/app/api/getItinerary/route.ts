import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { searchImage } from 'src/utils/imageSearch';
import { generateItineraryPrompt } from 'src/utils/itineraryPrompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { mood, location } = await request.json();

    if (!mood || typeof mood !== 'string' || !location || typeof location !== 'string') {
      return NextResponse.json({ error: 'Invalid mood or location provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = generateItineraryPrompt(mood, location);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const data = JSON.parse(text);

    if (!data.colorCode || !Array.isArray(data.activities) || data.activities.length !== 5) {
      throw new Error('Invalid response structure');
    }

    // Fetch images for each activity
    for (let i = 0; i < data.activities.length; i++) {
      const imageUrl = await searchImage(data.activities[i].activity, location);
      data.activities[i].imageUrl = imageUrl;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
