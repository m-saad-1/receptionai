import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessConfig extends Document {
  industryKey: string;
  businessName: string;
  accentColor: string;
  hours: string;
  services: any[];
  policies: string;
  createdAt: Date;
}

const BusinessConfigSchema: Schema = new Schema({
  industryKey: { type: String, required: true },
  businessName: { type: String, required: true },
  accentColor: { type: String, default: '#000000' },
  hours: { type: String, default: '' },
  services: { type: [Schema.Types.Mixed], default: [] },
  policies: { type: String, default: '' },
}, { timestamps: true });

export const BusinessConfig = mongoose.model<IBusinessConfig>('BusinessConfig', BusinessConfigSchema);
