import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();

    if (!word) {
      return NextResponse.json(
        { error: "Word is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert lexicographer. I will give you a single word.
Return a raw JSON object containing exactly three fields for this word:
1. "phoneticTranscription": The IPA phonetic transcription (e.g., "/ˈæp(ə)l/").
2. "meaning": A concise dictionary meaning of the word.
3. "exampleSentence": A clear example sentence using the word.

Do not include markdown formatting like \`\`\`json. Return only the raw JSON object.

Word: "${word}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model still includes it
    const cleanJsonString = responseText.replace(/```json\n?/, '').replace(/```\n?/, '').trim();
    
    const parsedData = JSON.parse(cleanJsonString);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to generate word details" },
      { status: 500 }
    );
  }
}
