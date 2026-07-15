"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamChatCompletion = streamChatCompletion;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
async function streamChatCompletion(systemPrompt, messages, res) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });
        const formattedMessages = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
        const history = formattedMessages.slice(0, -1);
        const lastMessage = formattedMessages[formattedMessages.length - 1]?.parts?.[0]?.text || '';
        const chat = model.startChat({
            history: history,
        });
        const result = await chat.sendMessageStream(lastMessage);
        let fullText = '';
        for await (const chunk of result.stream) {
            const text = chunk.text();
            fullText += text;
            res.write(`event: token\ndata: ${JSON.stringify({ text })}\n\n`);
        }
        res.write(`event: done\ndata: ${JSON.stringify({ fullText })}\n\n`);
        res.end();
        return fullText;
    }
    catch (error) {
        console.error('Gemini API Error:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Something went wrong — please try again', message: 'Failed to generate response' })}\n\n`);
        res.end();
        return null;
    }
}
//# sourceMappingURL=ai.service.js.map