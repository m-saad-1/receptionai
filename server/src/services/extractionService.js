"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLeadData = extractLeadData;
const generative_ai_1 = require("@google/generative-ai");
const Lead_1 = require("../models/Lead");
const personas_1 = require("../personas");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
async function extractLeadData(conversationId, industryKey, messages) {
    try {
        const persona = personas_1.personas[industryKey];
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
  "sentiment": "positive" | "neutral" | "negative"
}
Use null for anything not yet mentioned. Do not guess or infer values not stated by the user.

Conversation:
${conversationText}
    `;
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a precise data extraction API. Return ONLY valid JSON.",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Parse JSON
        const extracted = JSON.parse(responseText.trim());
        // Upsert into Lead
        await Lead_1.Lead.findOneAndUpdate({ conversationId }, {
            $set: {
                industryKey,
                name: extracted.name || null,
                phone: extracted.phone || null,
                email: extracted.email || null,
                requestedService: extracted.requestedService || null,
                preferredDateTime: extracted.preferredDateTime || null,
                partySize: extracted.partySize || null,
                notes: extracted.notes || null,
                intent: extracted.intent || "other",
                sentiment: extracted.sentiment || "neutral"
            }
        }, { upsert: true, new: true });
        console.log(`Lead data extracted and saved for conversation ${conversationId}`);
    }
    catch (error) {
        console.error('Lead extraction error:', error);
    }
}
//# sourceMappingURL=extractionService.js.map