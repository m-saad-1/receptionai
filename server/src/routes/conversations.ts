import { Router } from 'express';
import { Conversation } from '../models/Conversation';
import { Lead } from '../models/Lead';
import { personas, IndustryKey } from '../personas';
import { z } from 'zod';

const router = Router();

const initSchema = z.object({
  industryKey: z.string(),
});

router.post('/', async (req, res) => {
  try {
    const { industryKey } = initSchema.parse(req.body);
    
    if (!personas[industryKey as IndustryKey]) {
      return res.status(400).json({ error: 'INVALID_INDUSTRY', message: 'The provided industry key is invalid' });
    }

    const conversation = new Conversation({
      industryKey,
      messages: [],
      messageCount: 0,
    });
    
    await conversation.save();

    const persona = personas[industryKey as IndustryKey];

    res.status(201).json({
      conversationId: conversation._id,
      persona: {
        businessName: persona.businessName,
        accentColor: persona.accentColor,
        quickReplies: persona.quickReplies,
        systemPrompt: persona.systemPrompt,
      }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to create conversation' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Conversation not found' });
    }

    const lead = await Lead.findOne({ conversationId: id });

    res.status(200).json({
      conversation,
      lead,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to get conversation' });
  }
});

export default router;
