import { ElevenLabsClient } from "elevenlabs";

export function getElevenLabsClient(): ElevenLabsClient {
  return new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
}
