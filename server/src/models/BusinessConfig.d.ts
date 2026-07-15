import mongoose, { Document } from 'mongoose';
export interface IBusinessConfig extends Document {
    industryKey: string;
    businessName: string;
    accentColor: string;
    hours: string;
    services: any[];
    policies: string;
    createdAt: Date;
}
export declare const BusinessConfig: mongoose.Model<IBusinessConfig, {}, {}, {}, Document<unknown, {}, IBusinessConfig, {}, mongoose.DefaultSchemaOptions> & IBusinessConfig & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBusinessConfig>;
//# sourceMappingURL=BusinessConfig.d.ts.map