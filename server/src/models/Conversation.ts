import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  industryKey: string;
  messages: any[];
  messageCount: number;
  detectedIntent: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
  industryKey: { type: String, required: true },
  messages: { type: [Schema.Types.Mixed], default: [] },
  messageCount: { type: Number, default: 0 },
  detectedIntent: { type: String, default: '' },
}, { timestamps: true });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
