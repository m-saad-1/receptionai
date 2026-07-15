export type IndustryKey = "restaurant" | "salon" | "dental" | "gym";
export interface Persona {
    key: IndustryKey;
    businessName: string;
    accentColor: string;
    emoji: string;
    systemPrompt: string;
    quickReplies: string[];
    extractionSchemaHint: string;
}
export declare const personas: Record<IndustryKey, Persona>;
//# sourceMappingURL=index.d.ts.map