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

import { BusinessConfigMock } from './mock';
export const BusinessConfig = BusinessConfigMock as any;
