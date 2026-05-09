import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `You are an expert Hollywood screenwriter. The user has provided a very short story idea or keyword: "${topic}". 
      Expand this into a compelling, highly visual, and emotional 3-4 sentence cinematic story synopsis. 
      Do not include any pleasantries, just return the expanded story synopsis directly.`,
    });

    return NextResponse.json({ expandedText: text });
  } catch (error: any) {
    console.error('Enhance Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
