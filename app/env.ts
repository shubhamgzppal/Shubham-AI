import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';

const requiredEnvVars = [
  'GOOGLE_API_KEY',
  'AI_MODEL',
  'AI_IMAGE_MODEL',
  'MAX_TOKENS'
] as const;

type EnvVar = typeof requiredEnvVars[number];

export function validateEnv() {
  const missing: EnvVar[] = [];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnv();

const API_KEY = process.env.GOOGLE_API_KEY!;
let genAI: GoogleGenerativeAI;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error('Failed to initialize Google Generative AI:', error);
  throw error;
}

const MAX_TOKENS = Number(process.env.MAX_TOKENS) || 2048;
const TEMPERATURE = 0.7;

const defaultConfig = {
  temperature: TEMPERATURE,
  maxOutputTokens: MAX_TOKENS,
};

interface ModelConfig {
  model: string;
  generationConfig: typeof defaultConfig;
}

function createModel(config: ModelConfig) {
  try {
    return genAI.getGenerativeModel(config);
  } catch (error) {
    console.error(`Failed to create model ${config.model}:`, error);
    throw error;
  }
}

export const chatModel = createModel({
  model: process.env.AI_MODEL || 'gemini-2.5-flash-lite',
  generationConfig: defaultConfig,
});

export const fallbackChatModel = createModel({
  model: 'gemini-2.0-flash',
  generationConfig: defaultConfig,
});

export const imageModel = createModel({
  model: process.env.AI_IMAGE_MODEL || 'gemini-2.0-flash-preview-image-generation',
  generationConfig: defaultConfig,
});

export const startChat = async () => {
  try {
    return await chatModel.startChat({
      history: [],
      generationConfig: defaultConfig,
    });
  } catch (error) {
    console.error('Failed to start chat:', error);
    throw error;
  }
};
