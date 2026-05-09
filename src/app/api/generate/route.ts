import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow Vercel to run up to 60 seconds for AI generation
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import * as cheerio from 'cheerio';
const pdfParse = require('pdf-parse');

// Initialize Gemini
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Define the structured JSON output schema
const storyboardSchema = z.object({
  title: z.string(),
  viral_hook: z.string(),
  summary: z.string(),
  music_mood: z.string(),
  cta: z.string(),
  scenes: z.array(z.object({
    scene_number: z.number(),
    visual: z.string(),
    narration: z.string(),
    image_prompt: z.string(),
    video_prompt: z.string(),
    camera: z.string()
  })).min(5)
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const topic = formData.get('topic') as string;
    const url = formData.get('url') as string;
    const file = formData.get('file') as File | null;
    
    const mood = formData.get('mood') as string;
    const style = formData.get('style') as string;
    const duration = formData.get('duration') as string;
    const platform = formData.get('platform') as string;
    const christianMode = formData.get('christianMode') === 'true';

    let extractedText = '';

    // 1. Extract from PDF if uploaded
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      extractedText += `\n\n--- EXTRACTED PDF CONTENT ---\n${pdfData.text}\n---------------------------\n`;
    }

    // 2. Extract from URL if provided
    if (url) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        // Remove scripts, styles, etc to clean up text
        $('script, style, noscript, iframe, img, svg').remove();
        const cleanText = $('body').text().replace(/\s+/g, ' ').trim();
        // Limit to prevent massive tokens
        const truncatedText = cleanText.substring(0, 15000); 
        extractedText += `\n\n--- EXTRACTED WEBSITE CONTENT ---\n${truncatedText}\n------------------------------\n`;
      } catch (err) {
        console.error("Failed to fetch URL:", err);
      }
    }

    // 3. Add the manual topic if provided
    if (topic) {
      extractedText += `\n\n--- USER TOPIC / INSTRUCTIONS ---\n${topic}\n---------------------------------\n`;
    }

    let systemPrompt = `You are a Senior Hollywood Director and Expert Viral Video Producer for ${platform}.
    Create a highly engaging, cinematic storyboard based on the provided Source Material.
    The duration is ${duration}. The mood should be ${mood} and the visual style is ${style}.
    Output MUST be exactly 5 scenes minimum, matching the JSON schema precisely.`;

    if (christianMode) {
      systemPrompt += `\n\nCRITICAL: "Christian Cinematic Mode" is ON. 
      You MUST focus on spiritual themes, biblical allegories, and a respectful worship atmosphere.
      The narration should be emotional, faith-inspiring, and scripture-aligned.`;
    }

    const { object } = await generateObject({
      model: google('models/gemini-1.5-pro-latest'),
      schema: storyboardSchema,
      prompt: `${systemPrompt}\n\nSOURCE MATERIAL:\n${extractedText}`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate storyboard' }, { status: 500 });
  }
}
