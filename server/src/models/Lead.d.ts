import mongoose, { Document } from 'mongoose';
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
    createdAt: Date;
    updatedAt: Date;
}
export declare const Lead: mongoose.Model<ILead, {}, {}, {}, Document<unknown, {}, ILead, {}, mongoose.DefaultSchemaOptions> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILead>;
//# sourceMappingURL=Lead.d.ts.map