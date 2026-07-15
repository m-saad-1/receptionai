import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  conversationId: mongoose.Types.ObjectId;
  industryKey: string;
  name?: string;
  phone?: string;
  email?: string;
  requestedService?: string;
  preferredDateTime?: string;
  partySize?: number;
  notes?: string;
  intent: "booking" | "faq" | "pricing" | "complaint" | "other";
  sentiment?: "positive" | "neutral" | "negative";
  summarySentence?: string;
  nextActionSuggestion?: string;
  createdAt: Date;
  updatedAt: Date;
}

import { LeadMock } from './mock';
export const Lead = LeadMock as any;
