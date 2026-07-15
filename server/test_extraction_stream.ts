import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function run() {
  const prompt = `
Extract booking/lead information from this conversation so far. Respond ONLY with valid JSON matching this schema, no other text:
{
  "name": string | null,
  "phone": string | null,
  "email": string | null,
  "requestedService": string | null,
  "preferredDateTime": string | null,
  "partySize": number | null,
  "notes": string | null,
  "intent": "booking" | "faq" | "pricing" | "complaint" | "other",
  "sentiment": "positive" | "neutral" | "negative",
  "summarySentence": string | null,
  "nextActionSuggestion": string | null
}
Use null for anything not yet mentioned. Do not guess or infer values not stated by the user.

Conversation:
user: Hi, my name is John Doe and my phone number is 555-1234. I want a table for 2 tonight.
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: "You are a precise data extraction API. Return ONLY valid JSON.",
    });

    console.log("Starting chat...");
    const chat = model.startChat();
    const result = await chat.sendMessageStream(prompt);
    
    let responseText = '';
    for await (const chunk of result.stream) {
      responseText += chunk.text();
    }
    
    console.log("RAW RESPONSE:");
    console.log(responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log("No JSON object found in model response");
      return;
    }
    
    const extracted = JSON.parse(jsonMatch[0]);
    console.log("EXTRACTED JSON:");
    console.log(extracted);
  } catch (err: any) {
    console.error("ERROR:");
    console.error(err);
  }
}

run();
