import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  industryKey: string;
  messages: any[];
  messageCount: number;
  detectedIntent: string;
  createdAt: Date;
  updatedAt: Date;
}

import { ConversationModelMock } from './mock';
export const Conversation = ConversationModelMock as any;
