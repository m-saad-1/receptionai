import mongoose, { Document } from 'mongoose';
export interface IConversation extends Document {
    industryKey: string;
    messages: any[];
    messageCount: number;
    detectedIntent: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, Document<unknown, {}, IConversation, {}, mongoose.DefaultSchemaOptions> & IConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IConversation>;
//# sourceMappingURL=Conversation.d.ts.map