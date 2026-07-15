import { Router } from 'express';
import { Conversation } from '../models/Conversation';
import { streamChatCompletion } from '../services/ai.service';
import { extractLeadData } from '../services/extractionService';
import { Lead } from '../models/Lead';
import { personas, IndustryKey } from '../personas';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

router.post('/', async (req, res) => {
  console.log('[CHAT] Received request body:', JSON.stringify(req.body));
  try {
    const { conversationId, message } = chatSchema.parse(req.body);
    console.log('[CHAT] Parsed OK. convId:', conversationId);

    const conversation = await Conversation.findById(conversationId);
    console.log('[CHAT] Conversation found:', !!conversation);
    if (!conversation) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Conversation not found' });
    }

    if (conversation.messageCount >= 200) {
      return res.status(429).json({ error: 'DEMO_LIMIT_REACHED', message: 'Demo limit reached — Contact Saad to see the full version' });
    }

    // Set up SSE headers BEFORE any async work
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Flush immediately so client knows stream started
    console.log('[CHAT] SSE headers sent');

    // Add user message to history
    conversation.messages.push({ role: 'user', content: message });
    conversation.messageCount += 1;
    await conversation.save();

    const persona = personas[conversation.industryKey as IndustryKey];
    
    // Fetch current lead state to inject as context (prevents re-asking)
    const currentLead = await Lead.findOne({ conversationId });
    const leadContext = currentLead ? `
CURRENT EXTRACTED INFORMATION:
Name: ${currentLead.name || 'Unknown'}
Phone: ${currentLead.phone || 'Unknown'}
Service: ${currentLead.requestedService || 'Unknown'}
Date/Time: ${currentLead.preferredDateTime || 'Unknown'}
Party Size: ${currentLead.partySize || 'Unknown'}
Notes: ${currentLead.notes || 'Unknown'}
(Do not ask for information that is already provided above.)
` : '';

    // System prompt includes universal rules and persona logic
    const systemPrompt = persona.systemPrompt + "\n" + leadContext;

    console.log('[CHAT] Calling Gemini...');
    const fullReply = await streamChatCompletion(systemPrompt, conversation.messages, res);
    console.log('[CHAT] Gemini done. reply length:', fullReply?.length);

    if (fullReply) {
      // Add assistant message to history
      conversation.messages.push({ role: 'assistant', content: fullReply });
      await conversation.save();

      // Fire and forget extraction
      extractLeadData(conversationId, conversation.industryKey as IndustryKey, conversation.messages);
    }

  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to process chat message' });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'SERVER_ERROR', message: 'Failed to process chat message' })}\n\n`);
      res.end();
    }
  }
});

export default router;
