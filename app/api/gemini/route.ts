import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client using the key from your .env.local
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // We instruct Gemini to act as a strict data extractor
    const systemInstruction = `
      You are a financial data extractor. The user will give you a sentence about an expense.
      You must extract the amount, merchant, category, and date.
      Return ONLY a valid JSON object in this exact format, nothing else:
      {
        "amount": number,
        "merchant": "string",
        "category": "string (e.g., Food, Transport, Bills, Entertainment, Other)",
        "date": "YYYY-MM-DD"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + "\n\nUser input: " + prompt }] }
      ],
      config: {
        responseMimeType: "application/json", // This forces Gemini to return perfect JSON
      }
    });

    const aiText = response.text;
    if (!aiText) {
      throw new Error("No response text from Gemini");
    }

    // Parse the JSON from Gemini. In most cases `aiText` is a JSON string,
    // but if the SDK ever returns an object we gracefully fall back.
    let extractedData: any;
    try {
      extractedData =
        typeof aiText === "string" ? JSON.parse(aiText) : aiText;
    } catch (e) {
      console.error("Failed to JSON.parse Gemini output:", aiText, e);
      throw e;
    }

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to process expense" }, { status: 500 });
  }
}