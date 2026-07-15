"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuth_1 = require("../middleware/adminAuth");
const Lead_1 = require("../models/Lead");
const Conversation_1 = require("../models/Conversation");
const router = (0, express_1.Router)();
router.use(adminAuth_1.adminAuth);
router.get('/leads', async (req, res) => {
    try {
        const leads = await Lead_1.Lead.find().sort({ createdAt: -1 });
        const conversationsCount = await Conversation_1.Conversation.countDocuments();
        // Calculate stats
        const totalByIndustry = {};
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
    }
    catch (error) {
        console.error('Admin leads error:', error);
        res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch admin data' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map