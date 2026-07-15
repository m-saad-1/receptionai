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

const LeadSchema: Schema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  industryKey: { type: String, required: true },
  name: { type: String, default: null },
  phone: { type: String, default: null },
  email: { type: String, default: null },
  requestedService: { type: String, default: null },
  preferredDateTime: { type: String, default: null },
  partySize: { type: Number, default: null },
  notes: { type: String, default: null },
  intent: { type: String, default: '' },
  sentiment: { type: String, default: '' },
  summarySentence: { type: String, default: null },
  nextActionSuggestion: { type: String, default: null },
}, { timestamps: true });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
