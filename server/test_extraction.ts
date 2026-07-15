import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function run() {
  const prompt = `
Extract booking/lead information from this conversation so far. Respond ONLY with valid JSON matching this schema, no other text:
{
  "name": "string",
  "intent": "booking"
}
Conversation:
user: Hi, my name is John
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: "You are a precise data extraction API. Return ONLY valid JSON.",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    console.log("Generating...");
    const result = await model.generateContent(prompt);
    console.log("Result:", result.response.text());
  } catch (err: any) {
    console.error("ERROR:", err);
    import('fs').then(fs => fs.writeFileSync('error.log', String(err.message || err)));
  }
}
run();
