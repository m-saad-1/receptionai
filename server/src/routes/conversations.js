"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Conversation_1 = require("../models/Conversation");
const Lead_1 = require("../models/Lead");
const personas_1 = require("../personas");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const initSchema = zod_1.z.object({
    industryKey: zod_1.z.string(),
});
router.post('/', async (req, res) => {
    try {
        const { industryKey } = initSchema.parse(req.body);
        if (!personas_1.personas[industryKey]) {
            return res.status(400).json({ error: 'INVALID_INDUSTRY', message: 'The provided industry key is invalid' });
        }
        const conversation = new Conversation_1.Conversation({
            industryKey,
            messages: [],
            messageCount: 0,
        });
        await conversation.save();
        const persona = personas_1.personas[industryKey];
        res.status(201).json({
            conversationId: conversation._id,
            persona: {
                businessName: persona.businessName,
                accentColor: persona.accentColor,
                quickReplies: persona.quickReplies,
                systemPrompt: persona.systemPrompt,
            }
        });
    }
    catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to create conversation' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation_1.Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ error: 'NOT_FOUND', message: 'Conversation not found' });
        }
        const lead = await Lead_1.Lead.findOne({ conversationId: id });
        res.status(200).json({
            conversation,
            lead,
        });
    }
    catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to get conversation' });
    }
});
exports.default = router;
//# sourceMappingURL=conversations.js.map