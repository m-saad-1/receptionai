"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamChatCompletion = streamChatCompletion;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});
async function streamChatCompletion(systemPrompt, messages, res) {
    try {
        const stream = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content,
            })),
            stream: true,
        });
        let fullText = '';
        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                const text = chunk.delta.text;
                fullText += text;
                res.write(`event: token\ndata: ${JSON.stringify({ text })}\n\n`);
            }
        }
        res.write(`event: done\ndata: ${JSON.stringify({ fullText })}\n\n`);
        res.end();
        return fullText;
    }
    catch (error) {
        console.error('Claude API Error:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Something went wrong — please try again', message: 'Failed to generate response' })}\n\n`);
        res.end();
        return null;
    }
}
//# sourceMappingURL=claudeService.js.map