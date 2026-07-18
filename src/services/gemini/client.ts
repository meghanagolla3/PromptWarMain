import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '@/constants';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key is not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function isApiKeyConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  return !!apiKey && apiKey !== 'your_gemini_api_key_here';
}

export async function generateContent(prompt: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ 
      model: API_CONFIG.GEMINI_MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content from Gemini');
  }
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  let lastResponseText = '';

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({ 
        model: API_CONFIG.GEMINI_MODEL,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
      lastResponseText = text;
      
      // Clean up the response - remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to extract JSON from the response if it's embedded in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }
      
      // Fix common JSON issues: trailing commas, single quotes, etc.
      text = text.replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas
      text = text.replace(/'/g, '"'); // Replace single quotes with double quotes
      
      // Parse JSON response
      const parsed = JSON.parse(text);
      return parsed as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Gemini JSON generation error (attempt ${attempt + 1}/${maxRetries}):`, error);
      console.error('Response text:', lastResponseText);
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  console.error('Failed to generate JSON after retries:', lastError);
  throw new Error('Failed to generate JSON from Gemini');
}
