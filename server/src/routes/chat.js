"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Conversation_1 = require("../models/Conversation");
const ai_service_1 = require("../services/ai.service");
const extractionService_1 = require("../services/extractionService");
const personas_1 = require("../personas");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const chatSchema = zod_1.z.object({
    conversationId: zod_1.z.string(),
    message: zod_1.z.string(),
});
router.post('/', async (req, res) => {
    try {
        const { conversationId, message } = chatSchema.parse(req.body);
        const conversation = await Conversation_1.Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Conversation not found' });
        }
        if (conversation.messageCount >= 20) {
            return res.status(429).json({ error: 'DEMO_LIMIT_REACHED', message: 'Demo limit reached — Contact Saad to see the full version' });
        }
        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Add user message to history
        conversation.messages.push({ role: 'user', content: message });
        conversation.messageCount += 1;
        await conversation.save();
        const persona = personas_1.personas[conversation.industryKey];
        // System prompt includes universal rules and persona logic
        const systemPrompt = persona.systemPrompt;
        // Call Claude
        const fullReply = await (0, ai_service_1.streamChatCompletion)(systemPrompt, conversation.messages, res);
        if (fullReply) {
            // Add assistant message to history
            conversation.messages.push({ role: 'assistant', content: fullReply });
            await conversation.save();
            // Fire and forget extraction
            (0, extractionService_1.extractLeadData)(conversationId, conversation.industryKey, conversation.messages);
        }
    }
    catch (error) {
        console.error('Chat error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to process chat message' });
        }
        else {
            res.write(`event: error\ndata: ${JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to process chat message' })}\n\n`);
            res.end();
        }
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map