import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  
  const modelsToTest = [
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest"
  ];

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`✅ ${modelName} SUCCESS:`, result.response.text());
    } catch (err: any) {
      console.error(`❌ ${modelName} FAILED:`, err.status, err.message);
    }
  }
}
run();
