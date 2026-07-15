import { GoogleGenerativeAI } from '@google/generative-ai';
import { Lead } from '../models/Lead';
import type { IndustryKey } from '../personas';
import { personas } from '../personas';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function extractLeadData(conversationId: string, industryKey: IndustryKey, messages: any[]) {
  try {
    console.time(`Extraction-${conversationId}`);
    const persona = personas[industryKey];
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
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
"summarySentence" should be a single human-readable sentence summarizing what the AI has captured so far (e.g. "Sarah is requesting a table for 4 tomorrow at 7:00 PM.").
"nextActionSuggestion" should be a dynamic suggestion of the real-world next action for the business owner (e.g. "✅ This would notify your staff and add it to today's schedule", "⚠️ This conversation would be flagged for a callback").

Conversation:
${conversationText}
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: "You are a precise data extraction API. Return ONLY valid JSON.",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Sanitize markdown and find JSON block
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in model response: " + responseText);
    }
    
    // Parse JSON
    const extracted = JSON.parse(jsonMatch[0]);
    
    // Retry-safe updates: only overwrite if new value is provided, or if intent/sentiment change
    const updateFields: any = { industryKey };
    if (extracted.name !== null && extracted.name !== undefined) updateFields.name = extracted.name;
    if (extracted.phone !== null && extracted.phone !== undefined) updateFields.phone = extracted.phone;
    if (extracted.email !== null && extracted.email !== undefined) updateFields.email = extracted.email;
    if (extracted.requestedService !== null && extracted.requestedService !== undefined) updateFields.requestedService = extracted.requestedService;
    if (extracted.preferredDateTime !== null && extracted.preferredDateTime !== undefined) updateFields.preferredDateTime = extracted.preferredDateTime;
    if (extracted.partySize !== null && extracted.partySize !== undefined) updateFields.partySize = extracted.partySize;
    if (extracted.notes !== null && extracted.notes !== undefined) updateFields.notes = extracted.notes;
    if (extracted.intent) updateFields.intent = extracted.intent;
    if (extracted.sentiment) updateFields.sentiment = extracted.sentiment;
    if (extracted.summarySentence !== null && extracted.summarySentence !== undefined) updateFields.summarySentence = extracted.summarySentence;
    if (extracted.nextActionSuggestion !== null && extracted.nextActionSuggestion !== undefined) updateFields.nextActionSuggestion = extracted.nextActionSuggestion;

    // Upsert into Lead
    await Lead.findOneAndUpdate(
      { conversationId },
      { $set: updateFields },
      { upsert: true, new: true }
    );
    
    console.log(`Lead data extracted and saved for conversation ${conversationId}`);
    console.timeEnd(`Extraction-${conversationId}`);
  } catch (error: any) {
    console.error('Lead extraction error:', error);
    require('fs').appendFileSync('extraction_error.log', new Date().toISOString() + ': ' + (error?.message || String(error)) + '\\n');
  }
}
