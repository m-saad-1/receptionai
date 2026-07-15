import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { Lead } from '../models/Lead';
import { Conversation } from '../models/Conversation';

const router = Router();

router.use(adminAuth);

router.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const conversationsCount = await Conversation.countDocuments();
    
    // Calculate stats
    const totalByIndustry: Record<string, number> = {};
    leads.forEach(l => {
      totalByIndustry[l.industryKey] = (totalByIndustry[l.industryKey] || 0) + 1;
    });

    const leadsWithContact = leads.filter(l => l.name && (l.phone || l.email));
    const bookingConversionRate = conversationsCount > 0 
      ? Math.round((leadsWithContact.length / conversationsCount) * 100) 
      : 0;

    res.status(200).json({
      leads,
      stats: {
        totalConversations: conversationsCount,
        totalLeadsCaptured: leads.length,
        totalByIndustry,
        bookingConversionRate,
      }
    });
  } catch (error) {
    console.error('Admin leads error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch admin data' });
  }
});

export default router;
