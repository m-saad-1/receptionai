import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function streamChatCompletion(systemPrompt: string, messages: any[], res: any) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      systemInstruction: systemPrompt,
    });

    const formattedMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const history = formattedMessages.slice(0, -1);
    const lastMessage = formattedMessages[formattedMessages.length - 1]?.parts?.[0]?.text || '';

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 600,
      }
    });

    const result = await chat.sendMessageStream(lastMessage);

    let fullText = '';

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        res.write(`event: token\ndata: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`event: done\ndata: ${JSON.stringify({ fullText })}\n\n`);
    res.end();
    
    return fullText;
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    if (!res.writableEnded) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: 'Failed to generate response' })}\n\n`);
      res.end();
    }
    return null;
  }
}
