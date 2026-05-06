import OpenAI from "openai";

const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const apiKey  = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

export const openaiAvailable = !!(baseURL && apiKey);

export const openai = openaiAvailable
  ? new OpenAI({ apiKey: apiKey!, baseURL: baseURL! })
  : null;

export function requireOpenAI(): OpenAI {
  if (!openai) {
    throw new Error(
      "AI_INTEGRATIONS_OPENAI_BASE_URL and AI_INTEGRATIONS_OPENAI_API_KEY must be set. " +
      "Provision the OpenAI AI integration to enable Sentinel Chat."
    );
  }
  return openai;
}
